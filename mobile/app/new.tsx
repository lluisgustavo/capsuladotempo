import {
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Button,
} from 'react-native'
import Logo from '../src/assets/logo.svg'
import { Link, useRouter } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRef, useState } from 'react'
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import * as SecureStore from 'expo-secure-store'
import { api } from '../src/lib/api'

export default function NewMemory() {
  const { bottom, top } = useSafeAreaInsets()
  const [preview, setPreview] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState<boolean>(false)
  const [content, setContent] = useState('')
  const [type, setType] = useState<string | null>(null)
  const video = useRef<Video>(null)
  const [videoStatus, setVideoStatus] = useState<AVPlaybackStatus | null>(null)
  const router = useRouter()

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      })

      if (result?.assets[0]) {
        setPreview(result.assets[0].uri)
        setType(result.assets[0].type)
      }
    } catch (err) {
      // console.log(err)
    }
  }

  async function handleCreateMemory() {
    const token = await SecureStore.getItemAsync('token')

    let coverUrl = ''

    if (preview) {
      const uploadFormData = new FormData()

      uploadFormData.append('file', {
        uri: preview,
        name: type === 'video' ? 'video.mp4' : 'image.jpg',
        type: type === 'video' ? 'video/mp4' : 'image/jpeg',
      } as any)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      coverUrl = uploadResponse.data.fileUrl
    }

    await api.post(
      '/memories',
      {
        coverUrl,
        content,
        isPublic,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    router.push('/memories')
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <Logo />
        <Link href="/memories" asChild>
          <TouchableOpacity
            activeOpacity={0.7}
            className="h-10 w-10 items-center justify-center rounded-full bg-purple-500"
          >
            <Icon size={16} color="#fff" name="arrow-left" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: '#767577', true: '#6b2718' }}
            thumbColor={isPublic ? '#ff5c3a' : '#9e9ea0'}
          />
          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
          onPress={openImagePicker}
        >
          {preview && type !== null ? (
            type === 'image' ? (
              <View className="flex-row items-center gap-2">
                <Image
                  source={{ uri: preview }}
                  className="h-full w-full rounded-lg object-cover"
                  alt="Preview"
                />
              </View>
            ) : (
              <View className="h-full flex-row items-center justify-center gap-2">
                <Video
                  ref={video}
                  className="h-full w-full rounded-lg object-cover"
                  source={{
                    uri: preview,
                  }}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping
                  onPlaybackStatusUpdate={(status) =>
                    setVideoStatus(() => status)
                  }
                />
                <View className="absolute self-center">
                  <Button
                    title={
                      videoStatus?.isLoaded && videoStatus.isPlaying
                        ? 'Pause'
                        : 'Play'
                    }
                    onPress={() =>
                      videoStatus?.isLoaded && videoStatus.isPlaying
                        ? video.current.pauseAsync()
                        : video.current.playAsync()
                    }
                  />
                </View>
              </View>
            )
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#fff" />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          multiline
          textAlignVertical="top"
          onChangeText={setContent}
          className="p-0 font-body text-lg text-gray-50"
          placeholderTextColor="#56565a"
          placeholder="Fique livre para adicionar fotos, vídeo e relatos sobre essa experiência que você quer lembrar para sempre"
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleCreateMemory}
          className="mb-4 items-center self-center rounded-full bg-yellow-500 px-5 py-2"
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
