package com.docscan.ImageCrop;

import android.graphics.Bitmap;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.theartofdev.edmodo.cropper.CropImageView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.io.File;
import java.util.Map;
import java.util.UUID;

@ReactModule(name = ImageCropViewManager.NAME)
public class ImageCropViewManager extends SimpleViewManager<CropImageView> {


    public static final String NAME = "ImageCropView";
    private static final String SOURCE_URL_PROP = "sourceUrl";
    private static final String KEEP_ASPECT_RATIO_PROP = "keepAspectRatio";
    private static final String ASPECT_RATIO_PROP = "aspectRatio";
    private static final int SAVE_IMAGE_COMMAND = 1;
    private static final String SAVE_IMAGE_COMMAND_NAME = "saveImage";
    private static final String ON_IMAGE_SAVED = "onImageSaved";
    private static final String ON_SAVE_IMAGE_ERROR = "onSaveImageError";


    @NonNull
    @Override
    public String getName() {
        return NAME;
    }


    @NonNull
    @Override
    protected CropImageView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        CropImageView cropImageView = new CropImageView(themedReactContext);
        cropImageView.setOnCropImageCompleteListener(new CropImageView.OnCropImageCompleteListener() {
            @Override
            public void onCropImageComplete(@NonNull CropImageView cropImageView, @NonNull CropImageView.CropResult cropResult) {
                WritableMap response = Arguments.createMap();
                response.putString("uri", cropResult.getUri().getPath());
                response.putInt("width", cropResult.getCropRect().width());
                response.putInt("height", cropResult.getCropRect().height());

                ReactContext viewReactContext = (ReactContext) cropImageView.getContext();
                viewReactContext
                        .getJSModule(RCTEventEmitter.class)
                        .receiveEvent(cropImageView.getId(), ON_IMAGE_SAVED, response);
            }
        });
        return cropImageView;
    }


    @ReactProp(name = SOURCE_URL_PROP)
    public void setSourceUrl(CropImageView view, String url) {
        view.setImageUriAsync(Uri.parse(url));
    }

    @ReactProp(name = KEEP_ASPECT_RATIO_PROP)
    public void setFixedAspectRatio(CropImageView view, boolean fixed) {
        view.setFixedAspectRatio(fixed);
    }

    @ReactProp(name = ASPECT_RATIO_PROP)
    public void setAspectRatio(CropImageView view, ReadableMap aspectRatio) {
        if (aspectRatio != null) {
            view.setAspectRatio(aspectRatio.getInt("width"), aspectRatio.getInt("height"));
        } else {
            view.clearAspectRatio();
        }
    }


    @Override
    public void receiveCommand(@NonNull CropImageView root, int commandId, @Nullable ReadableArray args) {
        switch (commandId) {
            case SAVE_IMAGE_COMMAND:
                String extension = "jpg";
                Bitmap.CompressFormat format = Bitmap.CompressFormat.JPEG;
                if (root.getCroppedImage().hasAlpha()) {
                    extension = "png";
                    format = Bitmap.CompressFormat.PNG;
                }

                try {
                    String path = new File(root.getContext().getCacheDir(), UUID.randomUUID().toString() + "." + extension).toURI().toString();
                    root.saveCroppedImageAsync(Uri.parse(path), format, 100);
                } catch (Exception e) {
                    WritableMap response = Arguments.createMap();
                    response.putString("message", e.getMessage());
                    ReactContext reactContext = (ReactContext) root.getContext();
                    reactContext
                            .getJSModule(RCTEventEmitter.class)
                            .receiveEvent(root.getId(), ON_SAVE_IMAGE_ERROR, response);
                }
                break;
            default:
                throw new IllegalArgumentException("Unknown argument commandId");
        }
    }

    @Nullable
    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.builder()
                .put(ON_IMAGE_SAVED, MapBuilder.of("registrationName", ON_IMAGE_SAVED))
                .put(ON_SAVE_IMAGE_ERROR, MapBuilder.of("registrationName", ON_SAVE_IMAGE_ERROR))
                .build();
    }

    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
                SAVE_IMAGE_COMMAND_NAME, SAVE_IMAGE_COMMAND
        );
    }
}
