package com.docscan.ImageCrop;

import android.net.Uri;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import com.theartofdev.edmodo.cropper.CropImageView;


public class ImageCropViewManager extends ViewManager<CropImageView, LayoutShadowNode> {


    final String REACT_CLASS = "RNImageCrop";
    final String SOURCE_URL_PROP = "sourceUrl";
    final String KEEP_ASPECT_RATIO_PROP = "keepAspectRatio";
    final String ASPECT_RATIO_PROP = "cropAspectRatio";
    //final Integer SAVE_IMAGE_COMMAND = 1;
    //final Integer ROTATE_IMAGE_COMMAND = 2;
    //final String SAVE_IMAGE_COMMAND_NAME = "saveImage";
    //final String ROTATE_IMAGE_COMMAND_NAME = "rotateImage";
    //final String ON_IMAGE_SAVED = "onImageSaved";
    ReactApplicationContext mReactApplicationContext;


    public ImageCropViewManager(ReactApplicationContext reactApplicationContext) {
        mReactApplicationContext = reactApplicationContext;
    }


    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }


    @ReactProp(name=SOURCE_URL_PROP)
    public void setSourceUrl(CropImageView view, String url) {
        view.setImageUriAsync(Uri.parse(url));
    }

    @ReactProp(name=KEEP_ASPECT_RATIO_PROP)
    public void setFixedAspectRatio(CropImageView view, Boolean fixed) {
        view.setFixedAspectRatio(fixed);
    }

    @ReactProp(name=ASPECT_RATIO_PROP)
    public void setAspectRatio(CropImageView view, ReadableMap aspectRatio) {
        if (aspectRatio != null) {
            view.setAspectRatio(aspectRatio.getInt("width"), aspectRatio.getInt("height"));
        } else {
            view.clearAspectRatio();
        }
    }


    @NonNull
    @Override
    public CropImageView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        CropImageView view = new CropImageView(themedReactContext);
        view.setOnCropImageCompleteListener(new CropImageView.OnCropImageCompleteListener() {
            @Override
            public void onCropImageComplete(CropImageView view, CropImageView.CropResult result) {}
        });
        return view;
    }

    /*
    @Override
    public void receiveCommand(@NonNull CropImageView root, int commandId, ReadableArray args) {
        if (commandId == SAVE_IMAGE_COMMAND) {
            String fileName = args.getString(0);
            int quality = args.getInt(1);
            boolean preserveTransparency = args.getBoolean(2);

            String extension = ".jpg";
            Bitmap.CompressFormat format = Bitmap.CompressFormat.JPEG;
            if (preserveTransparency && root.getCroppedImage().hasAlpha()) {
                extension = ".png";
                format = Bitmap.CompressFormat.PNG;
            }

            String path = new File(root.getContext().getCacheDir(), fileName + extension).toURI().toString();
            root.saveCroppedImageAsync(Uri.parse(path), format, quality);
        } else if (commandId == ROTATE_IMAGE_COMMAND) {
            boolean clockwise = (args != null) && args.getBoolean(0);
            root.rotateImage(clockwise ? 90 : -90);
        }
    }
    */

    /*
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
         return MapBuilder.<String, Object>builder()
                 .put(ON_IMAGE_SAVED, MapBuilder.of("registrationName", ON_IMAGE_SAVED))
                 .build();
    }
    */

    /*
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
                SAVE_IMAGE_COMMAND_NAME, SAVE_IMAGE_COMMAND,
                ROTATE_IMAGE_COMMAND_NAME, ROTATE_IMAGE_COMMAND
        );
    }
    */


    @Override
    public LayoutShadowNode createShadowNodeInstance() {
        return new LayoutShadowNode();
    }

    @Override
    public Class<? extends LayoutShadowNode> getShadowNodeClass() {
        return LayoutShadowNode.class;
    }

    @Override
    public void updateExtraData(@NonNull CropImageView root, Object extraData) {}
}
