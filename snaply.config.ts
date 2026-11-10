// Replace with your own keys from the Snaply console (Products → your product → API key). An iOS
// product and an Android product each have their own. A key is not a secret: it ships inside every
// copy of your app and is checked server-side against the product's allowed app identifier.
export const iosKey = 'snap_live_REPLACE_WITH_YOUR_IOS_KEY';
export const androidKey = 'snap_live_REPLACE_WITH_YOUR_ANDROID_KEY';

// Development only: a backend on your own machine, e.g. 'http://localhost:5100' on the iOS
// simulator or 'http://10.0.2.2:5100' on the Android emulator. Leave undefined for Snaply itself.
export const host: string | undefined = undefined;
