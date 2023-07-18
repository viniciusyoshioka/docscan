package com.docscan.DocumentService;

import android.content.Intent;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;


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
    public void deletePictures(ReadableMap params) {
        ReadableArray pictures = params.getArray("pictures");
        String notificationTitle = params.getString("notificationTitle");

        if (pictures == null) return;

        Intent intent = new Intent(mReactApplicationContext, DocumentServiceService.class);
        intent.setAction(DocumentServiceService.ACTION_DELETE);
        intent.putExtra(DocumentServiceService.EXTRA_PICTURES_ARRAY, pictures.toArrayList());
        intent.putExtra(DocumentServiceService.EXTRA_NOTIFICATION_TITLE, notificationTitle);

        mReactApplicationContext.startService(intent);
    }

    @ReactMethod
    public void copyPictures(ReadableMap params) {
        ReadableArray pictures = params.getArray("pictures");
        String notificationTitle = params.getString("notificationTitle");

        if (pictures == null) return;

        Intent intent = new Intent(mReactApplicationContext, DocumentServiceService.class);
        intent.setAction(DocumentServiceService.ACTION_COPY);
        intent.putExtra(DocumentServiceService.EXTRA_PICTURES_ARRAY, pictures.toArrayList());
        intent.putExtra(DocumentServiceService.EXTRA_NOTIFICATION_TITLE, notificationTitle);

        mReactApplicationContext.startService(intent);
    }

    @ReactMethod
    public void movePictures(ReadableMap params) {
        ReadableArray pictures = params.getArray("pictures");
        String notificationTitle = params.getString("notificationTitle");

        if (pictures == null) return;

        Intent intent = new Intent(mReactApplicationContext, DocumentServiceService.class);
        intent.setAction(DocumentServiceService.ACTION_MOVE);
        intent.putExtra(DocumentServiceService.EXTRA_PICTURES_ARRAY, pictures.toArrayList());
        intent.putExtra(DocumentServiceService.EXTRA_NOTIFICATION_TITLE, notificationTitle);

        mReactApplicationContext.startService(intent);
    }

    @ReactMethod
    public void exportDocument(ReadableMap params) {
        ReadableArray pictures = params.getArray("pictures");
        String databasePath = params.getString("databasePath");
        String pathZipTo = params.getString("pathZipTo");
        String pathExportedDocument = params.getString("pathExportedDocument");
        String notificationTitle = params.getString("notificationTitle");

        if (pictures == null) return;

        Intent intent = new Intent(mReactApplicationContext, DocumentServiceService.class);
        intent.setAction(DocumentServiceService.ACTION_EXPORT);
        intent.putExtra(DocumentServiceService.EXTRA_PICTURES_ARRAY, pictures.toArrayList());
        intent.putExtra(DocumentServiceService.EXTRA_DATABASE_PATH, databasePath);
        intent.putExtra(DocumentServiceService.EXTRA_PATH_ZIP_TO, pathZipTo);
        intent.putExtra(DocumentServiceService.EXTRA_PATH_EXPORTED_DOCUMENT, pathExportedDocument);
        intent.putExtra(DocumentServiceService.EXTRA_NOTIFICATION_TITLE, notificationTitle);

        mReactApplicationContext.startService(intent);
    }
}
