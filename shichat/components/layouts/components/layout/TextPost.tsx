import { ImageSourcePropType } from "react-native";
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";

type User = {
    name: string;
    image: ImageSourcePropType;
}

interface TextProp {
    text: string;
    user: User;
    date?: string;
}

const { width } = Dimensions.get('window');

const TextPost = ({ text, user, date }: TextProp) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={user.image} style={styles.avatar} />
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{user.name}</Text>
                    {date && <Text style={styles.date}>{date}</Text>}
                </View>
            </View>
            <Text style={styles.content}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        width: width - 32,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
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
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    username: {
        fontWeight: '600',
        fontSize: 16,
        color: '#1f2937',
    },
    date: {
        color: '#6b7280',
        fontSize: 12,
    },
    content: {
        color: '#374151',
        fontSize: 15,
        lineHeight: 22,
    },
});

export default TextPost;