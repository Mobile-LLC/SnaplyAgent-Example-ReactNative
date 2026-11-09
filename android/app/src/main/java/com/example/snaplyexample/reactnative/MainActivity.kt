package com.example.snaplyexample.reactnative

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.snaply.agent.Snaply
import com.snaply.agent.SnaplyEnvironment
import com.snaply.agent.SnaplyUser

/**
 * Replace with your own key from the Snaply console (Products → your product → API key).
 *
 * It is not a secret. It identifies the workspace, ships inside every copy of your app, and is
 * checked server-side against your product's allowed package name.
 */
private const val SnaplyKey = "snap_live_REPLACE_WITH_YOUR_KEY"

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "SnaplyExample"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    startSnaply()
  }

  /**
   * The whole Android integration. React Native's views are native views, so nothing else is
   * needed for the SDK to capture the screen and to hide what is marked.
   */
  private fun startSnaply() {
    var key = SnaplyKey
    var environment: SnaplyEnvironment = SnaplyEnvironment.Live
    if (BuildConfig.DEBUG) {
      // Development only: the launch intent's `snaplyKey` / `snaplyHost` extras point a debug
      // build at another key, or at a backend running on your own machine.
      intent.getStringExtra("snaplyKey")?.let { key = it }
      intent.getStringExtra("snaplyHost")?.let { environment = SnaplyEnvironment.Custom(it) }
    }

    // `user` is optional — without it the device stays anonymous and support finds it by the
    // support code. Call Snaply.identify(id, name, phone) when someone signs in later.
    Snaply.init(
        context = this,
        key = key,
        environment = environment,
        user = SnaplyUser(id = "usr_20481", name = "Maya Kowalski"),
    )
  }
}
