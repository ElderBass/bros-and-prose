import Mailjet from "node-mailjet";

const getEmailMessaging = (updateType: string, data: { [key: string]: string }) => {
    console.log("Getting email messaging for update type:", updateType);
    switch (updateType) {
        case "discussion_note":
            return {
                title: "New Book Comment",
                message: `<span style="font-weight: bold;color:##00bfff;">@${data.username}</span> said some shit about <span style="font-weight: bold;color:#ff4dff;">${data.bookTitle}</span>.`,
                text: data.text,
            };
        case "like":
            return {
                title: "Item Update",
                message: `<span style="font-weight: bold;color:#00bfff;">@${data.username}</span> thinks your palaver is lit.`,
            };
        case "dislike":
            return {
                title: "Item Update",
                message: `<span style="font-weight: bold;color:#00bfff;">@${data.username}</span> thinks your shit's weak.`,
            };
        case "comment":
            return {
                title: "Item Update",
                message: `<span style="font-weight: bold;color:#00bfff;">@${data.username}</span> commented on your palaver.`,
                text: data.text,
            };
        case "progress_note":
            return {
                title: "New Progress Update",
                message: `<span style="font-weight: bold;color:#00bfff;">@${data.username}</span> made progress on the current book.`,
                text: data.text,
            };
        case "review":
            return {
                title: "New Review",
                message: `<span style="font-weight: bold;color:#00bfff;">@${data.username}</span> reviewed <span style="font-weight: bold;color:#ff4dff;">${data.bookTitle}</span>.`,
                text: data.text,
            };
        case "recommendation":
            return {
                title: "New Recommendation",
                message: `<span style="font-weight: bold;color:#00bfff;">@${data.username}</span> recommended <span style="font-weight: bold;color:#ff4dff;">${data.bookTitle}</span>.`,
                text: data.text,
            };
        case "suggestion":
            return {
                title: "New Suggestion",
                message: `<span style="font-weight: bold;color:#00bfff;">@${data.username}</span> suggested some shit for the app.`,
                text: data.text,
            };
        case "future_book_added":
            return {
                title: "New Future Book",
                message: `<span style="font-weight: bold;color:#00bfff;">@${
                    data.username
                }</span> nominated <span style="font-weight: bold;color:#ff4dff;">${
                    data.bookTitle?.toUpperCase() ?? ""
                }</span> as a future book.`,
            };
        default:
            return {
                title: "New Misc Item",
                message: `<span style="font-weight: bold;color:#00bfff;">@${data.username}</span> said some bullshit...`,
                text: data.text,
            };
    }
};

const getEmailRecipients = (targetUserEmail?: string) => {
    let recipients = [];
    if (targetUserEmail) {
        recipients.push(targetUserEmail);
    } else {
        recipients = process.env.EMAIL_RECIPIENTS?.split(",") || [];
    }
    return recipients.map((email) => ({ Email: email }));
};

const getEmailInfo = (updateType: string, data: { [key: string]: string }) => {
    const { title, message, text } = getEmailMessaging(updateType, data);
    const emailRecipients = getEmailRecipients(data.targetUserEmail);

    return {
        subject: "Bros and Prose Update",
        html: buildHtmlTemplate(title, message, text),
        emailRecipients,
    };
};

const buildHtmlTemplate = (title: string = "", message: string = "", text: string = "") => {
    const endpoint = title.toLocaleLowerCase().includes("future") ? "future" : "palaver";
    return `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
    </head>
    <body bgcolor="#0b0b13" style="margin:0;padding:0;background-color:#0b0b13;color:#f5f5f5;font-family:'Crimson Text',Georgia,serif;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#0b0b13" style="background-color:#0b0b13;padding:32px 0;">
            <tr>
                <td align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="540" style="background-color:#12121f;border:1px solid rgba(0,191,255,0.2);border-radius:18px;overflow:hidden;">
                        <tr>
                            <td align="center" style="padding:24px;background:linear-gradient(135deg,rgba(0,191,255,0.35),rgba(255,77,255,0.35));">
                                <p style="margin:0;text-transform:uppercase;letter-spacing:0.25em;color:#12121f;font-size:18px;font-weight:600;">bros & prose</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:32px;color:#f5f5f5;">
                                <h1 style="margin:0 0 18px;color:#00bfff;font-size:28px;font-family:'Libre Baskerville','Times New Roman',serif;">${
                                    title ?? ""
                                }</h1>
                                <p style="font-size:18px;line-height:1.6;margin:0 0 28px;">${
                                    message ?? ""
                                }</p>
                                <p style="font-size:14px;line-height:1.6;margin:0 0 20px;">${
                                    text ?? ""
                                }</p>
                                <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td align="center" style="border-radius:999px;background-color:#ff4dff;">
                                            <a href="https://bros-and-prose.vercel.app/${endpoint}" style="display:inline-block;padding:14px 32px;border-radius:999px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#0b0b13;text-decoration:none;">check it out</a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:24px;text-align:center;font-size:13px;color:#bdbdd2;border-top:1px solid rgba(0,191,255,0.08);">
                                <p style="margin:0;">You're getting this email because you're part of the Bros and Prose crew. If this feels unexpected, just ignore it or tell Seth to fuck all the way off.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>`;
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
        const { subject, html, emailRecipients } = getEmailInfo(updateType, data);

        const response = await mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: { Email: process.env.MAILJET_FROM_EMAIL || "" },
                    To: emailRecipients,
                    Subject: subject,
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
