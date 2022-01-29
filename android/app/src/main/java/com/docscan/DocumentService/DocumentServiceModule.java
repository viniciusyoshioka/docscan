package com.docscan.DocumentService;

import android.content.Intent;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;


public class DocumentServiceModule extends ReactContextBaseJavaModule {


    private final ReactApplicationContext mReactApplicationContext;


    public DocumentServiceModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        mReactApplicationContext = reactApplicationContext;
    }


    @NonNull
    @Override
    public String getName() {
        return "DocumentService";
    }


    @ReactMethod
    public void deletePictures(ReadableArray pictures, String notificationTitle) {
        Intent intent = new Intent(mReactApplicationContext, DocumentServiceService.class);
        intent.setAction(DocumentServiceService.ACTION_DELETE);
        intent.putExtra(DocumentServiceService.EXTRA_PICTURES_ARRAY, pictures.toArrayList());
        intent.putExtra(DocumentServiceService.EXTRA_NOTIFICATION_TITLE, notificationTitle);

        mReactApplicationContext.startService(intent);
    }

    @ReactMethod
    public void copyPictures(ReadableArray pictures, String notificationTitle) {
        Intent intent = new Intent(mReactApplicationContext, DocumentServiceService.class);
        intent.setAction(DocumentServiceService.ACTION_COPY);
        intent.putExtra(DocumentServiceService.EXTRA_PICTURES_ARRAY, pictures.toArrayList());
        intent.putExtra(DocumentServiceService.EXTRA_NOTIFICATION_TITLE, notificationTitle);

        mReactApplicationContext.startService(intent);
    }

    @ReactMethod
    public void movePictures(ReadableArray pictures, String notificationTitle) {
        Intent intent = new Intent(mReactApplicationContext, DocumentServiceService.class);
        intent.setAction(DocumentServiceService.ACTION_MOVE);
        intent.putExtra(DocumentServiceService.EXTRA_PICTURES_ARRAY, pictures.toArrayList());
        intent.putExtra(DocumentServiceService.EXTRA_NOTIFICATION_TITLE, notificationTitle);

        mReactApplicationContext.startService(intent);
    }
}
