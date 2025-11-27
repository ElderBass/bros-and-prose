import Mailjet from "node-mailjet";

const getEmailMessaging = (updateType: string, data: { [key: string]: string }) => {
    console.log("Getting email messaging for update type:", updateType);
    switch (updateType) {
        case "discussion_note":
            return {
                text: `${data.username} said some shit about ${data.bookTitle}. It's time to check it out!`,
                html:
                    "<h3>Palaver Alert: New Book Comment</h3><p>" +
                    `${data.username} said some shit about ${data.bookTitle}. <a href='https://bros-and-prose.vercel.app/palaver'>Check it out.</a></p>`,
            };
        case "like":
            return {
                text: `${data.username} liked your palaver. It's time to check it out!`,
                html:
                    "<h3>Palaver Alert: New Item Liked</h3><p>" +
                    `${data.username} liked your palaver. <a href='https://bros-and-prose.vercel.app/palaver'>Check it out.</a></p>`,
            };
        case "dislike":
            return {
                text: `${data.username} thinks your shit's weak. Check it out!`,
                html:
                    "<h3>Palaver Alert: New Item Disliked</h3><p>" +
                    `${data.username} thinks your shit's weak. <a href='https://bros-and-prose.vercel.app/palaver'>Check it out.</a></p>`,
            };
        case "comment":
            return {
                text: `${data.username} commented on your palaver. Check it out!`,
                html:
                    "<h3>Palaver Alert: New Comment</h3><p>" +
                    `${data.username} commented on your palaver. <a href='https://bros-and-prose.vercel.app/palaver'>Check it out.</a></p>`,
            };
        case "progress_note":
            return {
                text: `${data.username} made progress on the current book. Check it out!`,
                html:
                    "<h3>Palaver Alert: New Progress</h3><p>" +
                    `${data.username} made progress on the current book. <a href='https://bros-and-prose.vercel.app/palaver'>Check it out.</a></p>`,
            };
        case "review":
            return {
                text: `${data.username} reviewed ${data.bookTitle}. Check it out!`,
                html:
                    "<h3>Palaver Alert: New Review</h3><p>" +
                    `${data.username} reviewed ${data.bookTitle}. <a href='https://bros-and-prose.vercel.app/palaver'>Check it out.</a></p>`,
            };
        case "recommendation":
            return {
                text: `${data.username} recommended ${data.bookTitle}. Check it out!`,
                html:
                    "<h3>Palaver Alert: New Recommendation</h3><p>" +
                    `${data.username} recommended ${data.bookTitle}. <a href='https://bros-and-prose.vercel.app/palaver'>Check it out.</a></p>`,
            };
        case "suggestion":
            return {
                text: `${data.username} suggested some shit for the app. Check it out!`,
                html:
                    "<h3>Palaver Alert: New Suggestion</h3><p>" +
                    `${data.username} suggested some shit for the app. <a href='https://bros-and-prose.vercel.app/palaver'>Check it out.</a></p>`,
            };
        default:
            return {
                text: `${data.username} has thoughts... Check it out!`,
                html:
                    "<h3>Palaver Alert: New Misc Post</h3><p>" +
                    `${data.username} has thoughts... <a href='https://bros-and-prose.vercel.app/palaver'>Check it out.</a></p>`,
            };
    }
};

const getEmailRecipients = (targetUserEmail?: string) => {
    let recipients = [];
    if (targetUserEmail) {
        recipients.push({ Email: targetUserEmail });
    } else {
        recipients = process.env.EMAIL_RECIPIENTS?.split(",") || [];
    }
    return recipients.map((email) => ({ Email: email }));
};

const getEmailInfo = (updateType: string, data: { [key: string]: string }) => {
    const { text, html } = getEmailMessaging(updateType, data);
    const emailRecipients = getEmailRecipients(data.targetUserEmail);

    return {
        subject: "Bros and Prose Update",
        text,
        html,
        emailRecipients,
    };
};

export const sendEmailNotification = async (
    updateType: string,
    data: { [key: string]: string }
) => {
    try {
        const mailjet = Mailjet.Client.apiConnect(
            process.env.MAILJET_API_KEY || "",
            process.env.MAILJET_API_SECRET || ""
        );
        const { subject, text, html, emailRecipients } = getEmailInfo(updateType, data);

        console.log("Sending email notification to:", emailRecipients);
        console.log("Email subject:", subject);
        console.log("Email text:", text);
        console.log("Email html:", html);

        const response = await mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: { Email: process.env.MAILJET_FROM_EMAIL || "" },
                    To: emailRecipients,
                    Subject: subject,
                    TextPart: text,
                    HTMLPart: html,
                },
            ],
        });
        console.log("Email notification sent successfully:", response.body);
        return response.body;
    } catch (error) {
        console.error("Error sending email notification:", error);
        throw error;
    }
};
