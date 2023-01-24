import { Header, HeaderButton, HeaderTitle } from "../../components"
import { translate } from "../../locales"


export interface VisualizePictureHeaderProps {
    goBack: () => void;
    isCropping: boolean;
    openCamera: () => void;
    openCrop: () => void;
    exitCrop: () => void;
    saveCroppedPicture: () => void;
}


export function VisualizePictureHeader(props: VisualizePictureHeaderProps) {
    return (
        <Header>
            {!props.isCropping && (
                <HeaderButton
                    iconName={"arrow-back"}
                    onPress={props.goBack}
                />
            )}

            {props.isCropping && (
                <HeaderButton
                    iconName={"close"}
                    onPress={props.exitCrop}
                />
            )}

            {!props.isCropping && (
                <HeaderTitle title={translate("VisualizePicture_header_visualize_title")} />
            )}

            {props.isCropping && (
                <HeaderTitle title={translate("VisualizePicture_header_crop_title")} />
            )}

            {!props.isCropping && (
                <HeaderButton
                    iconName={"image-edit-outline"}
                    iconGroup={"material-community"}
                    onPress={props.openCamera}
                />
            )}

            {!props.isCropping && (
                <HeaderButton
                    iconName={"crop"}
                    onPress={props.openCrop}
                />
            )}

            {props.isCropping && (
                <HeaderButton
                    iconName={"done"}
                    onPress={props.saveCroppedPicture}
                />
            )}
        </Header>
    )
}
