import { ImageSourcePropType } from "react-native";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

type User = {
    name: string;
    image: ImageSourcePropType;
}

interface ImgProp {
    imag: ImageSourcePropType;
    text?: string;
    user: User;
    date?: string;
}

const { width } = Dimensions.get('window');

const ImgPost = ({ imag, text, user, date }: ImgProp) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={user.image} style={styles.avatar} />
                <Text style={styles.username}>{user.name}</Text>
                {date && (
                    <Text style={styles.date}>{date}</Text>
                )}
            </View>
            
            <View style={styles.imageContainer}>
                <Image 
                    source={imag} 
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
            
            {text && <Text style={styles.text}>{text}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        width: width - 32, // Full width with some margin
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    username: {
        fontWeight: '600',
        fontSize: 16,
    },
    date: {
        color: '#6b7280',
        fontSize: 12,
        marginLeft: 'auto',
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1, // Adjust this as needed
        marginBottom: 12,
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    text: {
        color: '#374151',
        fontSize: 14,
        lineHeight: 20,
    },
});

export default ImgPost;