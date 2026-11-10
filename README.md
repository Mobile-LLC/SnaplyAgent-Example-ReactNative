# Snaply Agent — React Native example

A runnable React Native app with Snaply Agent inside, through the
[`@snaplyagent/react-native`](https://github.com/Mobile-LLC/SnaplyAgent-SDK-ReactNative) package.

The whole integration is in [`App.tsx`](App.tsx): `Snaply.on` and `Snaply.configure`, and
`<SnaplyRedact>` around what must never leave the phone. There is no Snaply code in the `ios` or
`android` folders.

## Run it

1. `npm install`, and for iOS `cd ios && pod install`.
2. Replace the two placeholder keys in [`snaply.config.ts`](snaply.config.ts):

   ```
   snap_live_REPLACE_WITH_YOUR_IOS_KEY
   snap_live_REPLACE_WITH_YOUR_ANDROID_KEY
   ```

   Get yours from the Snaply console → **Products → your product → API key**. An iOS product and
   an Android product each have their own key.

3. Add the app's identifier to each product's allowed list, or registration is refused. This
   example uses `com.example.snaplyexample.reactnative` on both platforms.
4. `npx react-native run-ios` or `npx react-native run-android`.
5. Open the console, find the device, and request a screenshot. The consent prompt appears on the
   phone; nothing is captured until it is allowed.

## Adding Snaply to your own React Native app

```sh
npm install github:Mobile-LLC/SnaplyAgent-SDK-ReactNative
cd ios && pod install
```

```tsx
import { Snaply } from '@snaplyagent/react-native';

await Snaply.configure({ key: 'snap_live_…' });
```

Nothing else is needed on either platform — no `AppDelegate` or `MainActivity` code, no Swift
package, no Gradle line.

## What the screen shows

| In `App.tsx` | In the capture |
|---|---|
| `<TextInput secureTextEntry />` | Hidden on its own |
| `<SnaplyRedact>` around the card number and the address | Hidden |
| `testID="ibanField"` | Hidden once the dashboard has a rule by identifier `ibanField` |
| A field with the placeholder "Passport number" | Hidden once the dashboard has a rule by text `passport` |
| The delivery note | Captured as it is — nothing marks it |

The box is painted **on the device, before the image is encoded**, and a hidden field takes neither
a tap nor text from an agent with remote control. The "Add one more" button is an ordinary
`Pressable`: an agent's tap presses it on both platforms.

The links under the button call `Snaply.reset()`, `Snaply.identify(…)` and
`Snaply.showSupportCode()`; the line below them is fed by the callbacks.

What the agent received — iOS and Android:

| iOS | Android |
|---|---|
| ![The capture on iOS](docs/capture-ios.png) | ![The capture on Android](docs/capture-android.png) |

On iOS a `<Text>` is its own accessibility label, so the rule by text also hides the caption
"Passport". What was measured, and what was not, is in the
[package's README](https://github.com/Mobile-LLC/SnaplyAgent-SDK-ReactNative#what-was-measured).

## Pointing the app at another backend

Set `host` in `snaply.config.ts` — `http://localhost:5100` on the iOS simulator,
`http://10.0.2.2:5100` on the Android emulator. Plain `http` is accepted for the machine's own
loopback only.

## Docs

<https://snaplyagent.com/docs>
