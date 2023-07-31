import { ForwardedRef, forwardRef, useImperativeHandle, useState } from "react"
import { StyleSheet, View, ViewProps } from "react-native"


export interface PictureTakenFeedbackRef {
    showFeedback: () => void;
}


export const PictureTakenFeedback = forwardRef((props: ViewProps, ref: ForwardedRef<PictureTakenFeedbackRef>) => {


    const [isVisible, setIsVisible] = useState(false)


    useImperativeHandle(ref, () => ({
        showFeedback,
    }))


    function showFeedback() {
        setIsVisible(true)
        setTimeout(() => {
            setIsVisible(false)
        }, 30)
    }


    if (!isVisible) return null


    return <View {...props} style={[styles.container, props.style]} />
})


const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
})
