import type { Alert } from "@/types";

export const DEFAULT_ALERT: Alert = {
    show: false,
    messages: [],
    type: "info",
    duration: 5000,
    dismissable: false,
};

// Success Alerts
export const UPDATE_PROGRESS_SUCCESS_ALERT: Alert = {
    show: true,
    messages: [
        "progress updated successfully.",
        "look at you, all reading and shit.",
    ],
    type: "success",
    duration: 5000,
    dismissable: false,
};

export const REVIEW_SUBMITTED_SUCCESS_ALERT: Alert = {
    show: true,
    messages: [
        "review submitted successfully.",
        "fukkin' sent that shit, my dude.",
    ],
    type: "success",
    duration: 5000,
    dismissable: false,
};

export const PROFILE_UPDATED_SUCCESS_ALERT: Alert = {
    show: true,
    messages: [
        "avatar updated successfully.",
        "your face looks better, but your personality still sucks.",
    ],
    type: "success",
    duration: 5000,
    dismissable: false,
};

export const USERNAME_UPDATED_SUCCESS_ALERT: Alert = {
    show: true,
    messages: [
        "username updated successfully.",
        "this is NOT helping with your street cred, my dude.",
    ],
    type: "success",
    duration: 5000,
    dismissable: false,
};

export const DISCUSSION_COMMENT_ADDED_SUCCESS_ALERT: Alert = {
    show: true,
    messages: [
        "discussion comment added successfully.",
        "if you thought this insightful, you're delusional.",
    ],
    type: "success",
    duration: 5000,
    dismissable: false,
};

export const FUTURE_BOOK_ADDED_SUCCESS_ALERT: Alert = {
    show: true,
    messages: [
        "future book added successfully.",
        "that book looks like it might not suck.",
    ],
    type: "success",
    duration: 5000,
    dismissable: false,
};

export const LIKED_PALAVER_ENTRY_SUCCESS_ALERT: Alert = {
    show: true,
    messages: [
        "liked palaver entry successfully.",
        "'you like that??' - Kirko Thuggins",
    ],
    type: "success",
    duration: 5000,
    dismissable: false,
};

export const DISLIKED_PALAVER_ENTRY_SUCCESS_ALERT: Alert = {
    show: true,
    messages: ["disliked palaver entry successfully.", "shit's weak, bro, lol"],
    type: "success",
    duration: 5000,
    dismissable: false,
};

export const ADDED_COMMENT_SUCCESS_ALERT: Alert = {
    show: true,
    messages: ["comment added successfully.", "your comment is now live."],
    type: "success",
    duration: 5000,
    dismissable: false,
};

export const UPDATED_COMMENT_SUCCESS_ALERT: Alert = {
    show: true,
    messages: ["comment updated successfully.", "your comment is now live."],
    type: "success",
    duration: 5000,
    dismissable: false,
};

export const MOVED_BOOK_SUCCESS_ALERT: Alert = {
    show: true,
    messages: [
        "fuckin sent that shit, my dude.",
        "buckle up, buttercup, cuz you got some reading to do.",
    ],
    type: "success",
    duration: 5000,
    dismissable: false,
};

export const movedBookSuccessAlert = (
    targetShelf: "currentlyReading" | "haveRead"
): Alert => {
    const messages =
        targetShelf === "currentlyReading"
            ? [
                  "locked and loaded. go read that shit.",
                  "buckle up, buttercup, cuz you got some reading to do.",
              ]
            : [
                  "hell yeah. another one bites the dust.",
                  "that book is officially in the past tense.",
              ];

    return {
        show: true,
        messages,
        type: "success",
        duration: 5000,
        dismissable: false,
    };
};

export const REMOVED_BOOK_SUCCESS_ALERT: Alert = {
    show: true,
    messages: [
        "sent that shit to oblivion, my guy.",
        "that book is now like my will to live - R.I.P.",
    ],
    type: "success",
    duration: 5000,
    dismissable: false,
};

export const futureBookVotedSuccessAlert = (hasVoted: boolean): Alert => {
    const message1 = hasVoted
        ? "vote removed successfully."
        : "vote cast successfully.";
    const message2 = hasVoted
        ? "on second thought, fuck that book."
        : "lfgo that book looks tight.";
    return {
        show: true,
        messages: [message1, message2],
        type: "success",
        duration: 5000,
        dismissable: false,
    };
};

// Error Alerts
export const VALIDATION_ERROR_ALERT: Alert = {
    show: true,
    messages: ["please check your input and try again, skibidi"],
    type: "error",
    duration: 5000,
    dismissable: true,
};

// Warning Alerts
export const UNSAVED_CHANGES_WARNING_ALERT: Alert = {
    show: true,
    messages: ["you have unsaved changes that will be lost"],
    type: "warning",
    duration: 0, // Persistent until dismissed
    dismissable: true,
};

export const SLOW_CONNECTION_WARNING_ALERT: Alert = {
    show: true,
    messages: ["slow connection detected - this might take a while"],
    type: "warning",
    duration: 5000,
    dismissable: true,
};

// Info Alerts
export const WELCOME_INFO_ALERT: Alert = {
    show: true,
    messages: ["welcome to bros and prose! let's get reading"],
    type: "info",
    duration: 4000,
    dismissable: true,
};

export const FEATURE_INFO_ALERT: Alert = {
    show: true,
    messages: ["new feature available - check out the latest updates"],
    type: "info",
    duration: 6000,
    dismissable: true,
};

// Utility function to create custom alerts
export const createAlert = (
    messages: string[],
    type: Alert["type"] = "info",
    duration: number = 3000,
    dismissable: boolean = false
): Alert => ({
    show: true,
    messages,
    type,
    duration,
    dismissable,
});

// Quick alert presets
export const QUICK_SUCCESS = (messages: string[]): Alert =>
    createAlert(messages, "success", 2500, false);

export const QUICK_ERROR = (messages: string[]): Alert =>
    createAlert(messages, "error", 4000, true);

export const QUICK_WARNING = (messages: string[]): Alert =>
    createAlert(messages, "warning", 3500, true);

export const QUICK_INFO = (messages: string[]): Alert =>
    createAlert(messages, "info", 3000, false);
