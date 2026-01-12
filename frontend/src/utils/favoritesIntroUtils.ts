const INTRO_COMPLETED_KEY = "bros-and-prose:favorites-intro-completed";
const INTRO_REMIND_LATER_KEY = "bros-and-prose:favorites-intro-remind-later";
const REMIND_LATER_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function markFavoritesIntroAsCompleted(): void {
    localStorage.setItem(INTRO_COMPLETED_KEY, "true");
    localStorage.removeItem(INTRO_REMIND_LATER_KEY); // Clear any reminder
}

export function markFavoritesIntroAsPermanentlyDismissed(): void {
    localStorage.setItem(INTRO_COMPLETED_KEY, "true");
    localStorage.removeItem(INTRO_REMIND_LATER_KEY);
}

export function setRemindMeLater(): void {
    const timestamp = Date.now().toString();
    localStorage.setItem(INTRO_REMIND_LATER_KEY, timestamp);
}

export function shouldShowFavoritesIntro(isLoggedInUser: boolean): boolean {
    if (!isLoggedInUser) return false;

    // Never show if completed or permanently dismissed
    const completed = localStorage.getItem(INTRO_COMPLETED_KEY) === "true";
    if (completed) return false;

    // Check if "remind me later" was clicked
    const remindLaterTimestamp = localStorage.getItem(INTRO_REMIND_LATER_KEY);

    if (remindLaterTimestamp) {
        const timestamp = parseInt(remindLaterTimestamp, 10);
        const now = Date.now();
        const elapsed = now - timestamp;

        // If less than 24 hours have passed, don't show
        if (elapsed < REMIND_LATER_DURATION_MS) {
            return false;
        }

        // More than 24 hours have passed, show again
        return true;
    }

    // Never seen before, show it
    return true;
}
