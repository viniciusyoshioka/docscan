package com.docscan

import android.app.Application
import cl.json.ShareApplication
// import com.docscan.DocumentService.DocumentServicePackage
// import com.docscan.ImageCrop.ImageCropPackage
// import com.docscan.ImageTools.ImageToolsPackage
// import com.docscan.PdfCreator.PdfCreatorPackage
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

class MainApplication : Application(), ReactApplication, ShareApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
          // add(DocumentServicePackage())
          // add(ImageCropPackage())
          // add(ImageToolsPackage())
          // add(PdfCreatorPackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }

  override fun getFileProviderAuthority(): String {
    return BuildConfig.APPLICATION_ID + ".provider"
  }
}
