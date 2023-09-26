
static class OrientationData {
    public int rotationDegree = 0;
    public boolean isFlipped = false;
}

private OrientationData getOrientationData(int orientation) {
    OrientationData orientationData = new OrientationData();

    switch (orientation) {
        case ExifInterface.ORIENTATION_NORMAL:
            break;
        case ExifInterface.ORIENTATION_ROTATE_90:
            orientationData.rotationDegree = 90;
            break;
        case ExifInterface.ORIENTATION_ROTATE_180:
            orientationData.rotationDegree = 180;
            break;
        case ExifInterface.ORIENTATION_ROTATE_270:
            orientationData.rotationDegree = 270;
            break;
        case ExifInterface.ORIENTATION_FLIP_HORIZONTAL:
            orientationData.isFlipped = true;
            break;
        case ExifInterface.ORIENTATION_FLIP_VERTICAL:
            orientationData.isFlipped = true;
            orientationData.rotationDegree = 180;
            break;
        case ExifInterface.ORIENTATION_TRANSPOSE:
            orientationData.isFlipped = true;
            orientationData.rotationDegree = 270;
            break;
        case ExifInterface.ORIENTATION_TRANSVERSE:
            orientationData.isFlipped = true;
            orientationData.rotationDegree = 90;
            break;
    }

    return orientationData;
}

private int getOrientationExifValue(OrientationData orientationData) {
    boolean isFlipped = orientationData.isFlipped;

    switch (orientationData.rotationDegree) {
        case 0:
            return isFlipped ? ExifInterface.ORIENTATION_FLIP_HORIZONTAL : ExifInterface.ORIENTATION_NORMAL;
        case 90:
            return isFlipped ? ExifInterface.ORIENTATION_TRANSVERSE : ExifInterface.ORIENTATION_ROTATE_90;
        case 180:
            return isFlipped ? ExifInterface.ORIENTATION_FLIP_VERTICAL : ExifInterface.ORIENTATION_ROTATE_180;
        case 270:
            return isFlipped ? ExifInterface.ORIENTATION_TRANSPOSE : ExifInterface.ORIENTATION_ROTATE_270;
        default:
            return ExifInterface.ORIENTATION_UNDEFINED;
    }
}
