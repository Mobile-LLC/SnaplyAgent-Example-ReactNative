import SnaplyAgent
import UIKit

/// Replace with your own key from the Snaply console (Products → your product → API key).
///
/// It is not a secret. It identifies the workspace, ships inside every copy of your app, and is
/// checked server-side against your product's allowed bundle id.
private let snaplyKey = "snap_live_REPLACE_WITH_YOUR_KEY"

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    startSnaply()
    return true
  }

  /// The whole iOS integration. React Native's views are native views, so nothing else is needed
  /// for the SDK to capture the screen and to hide what is marked.
  private func startSnaply() {
    var key = snaplyKey
    var environment = SnaplyEnvironment.live
    #if DEBUG
    // Development only: SNAPLY_KEY / SNAPLY_HOST in the launch environment point a debug build at
    // another key, or at a backend running on your own machine.
    let launch = ProcessInfo.processInfo.environment
    if let value = launch["SNAPLY_KEY"] { key = value }
    if let host = launch["SNAPLY_HOST"].flatMap({ URL(string: $0) }) { environment = .custom(host) }
    #endif

    // `user` is optional — without it the device stays anonymous and support finds it by the
    // support code. Call Snaply.identify(id:name:phone:) when someone signs in later.
    Snaply.configure(
      key: key,
      environment: environment,
      user: SnaplyUser(id: "usr_20481", name: "Maya Kowalski")
    ) { error in
      // `invalid_key` means the placeholder above is still there; `origin_mismatch` means this
      // app's bundle id is not on the product's allowed list.
      if let error { NSLog("Snaply: could not connect — %@", error.localizedDescription) }
    }
  }
}
