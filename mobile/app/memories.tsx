import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Image,
  Button,
} from 'react-native'
import Logo from '../src/assets/logo.svg'
import { Link, useRouter } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'
import React, { useState, useEffect, useRef } from 'react'
import { api } from '../src/lib/api'
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

dayjs.locale(ptBr)

interface Memory {
  isPublic: boolean
  createdAt: string
  coverUrl: string
  excerpt: string
  id: string
}

export default function NewMemory() {
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()
  const [memories, setMemories] = useState<Memory[]>([])
  const video = useRef<Video>(null)
  const [videoStatus, setVideoStatus] = useState<AVPlaybackStatus | null>(null)

  async function signOut() {
    await SecureStore.deleteItemAsync('token')

    router.push('/')
  }

  async function loadMemories() {
    const token = await SecureStore.getItemAsync('token')

    const response = await api.get('/memories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setMemories(response.data)
  }

  useEffect(() => {
    loadMemories()
  }, [])

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingBottom: bottom,
        paddingTop: top,
      }}
    >
      <View className="mt-4 flex-row items-center justify-between px-8">
        <Logo />
        <View className="flex-row gap-1.5">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon size={16} color="#fff" name="log-out" />
          </TouchableOpacity>
          <Link href="/new" asChild>
            <TouchableOpacity
              activeOpacity={0.7}
              className="h-10 w-10 items-center justify-center rounded-full bg-yellow-500"
            >
              <Icon size={16} color="#fff" name="plus" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="mt-6 space-y-10">
        {memories.map((memory) => {
          return (
            <View key={memory.id} className="space-y-4">
              <View className="flex-row items-center gap-2">
                <View className="h-px w-5 bg-gray-50" />
                <Text className="font-body text-xs text-gray-100">
                  {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
                </Text>
              </View>
              <View className="space-y-4 px-8">
                {memory.coverUrl.toString().endsWith('mp4') ? (
                  <View className="flex items-center justify-center">
                    <Video
                      ref={video}
                      className="aspect-video w-full rounded-lg"
                      source={{
                        uri: memory.coverUrl,
                      }}
                      useNativeControls
                      resizeMode={ResizeMode.CONTAIN}
                      isLooping
                      onPlaybackStatusUpdate={(status) =>
                        setVideoStatus(() => status)
                      }
                    />
                    <View className="absolute self-center align-middle">
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
                ) : (
                  <Image
                    source={{
                      uri: memory.coverUrl,
                    }}
                    className="aspect-video w-full rounded-lg"
                    alt=""
                  ></Image>
                )}
              </View>
              <Text className="px-8 font-body text-base leading-relaxed text-gray-100">
                {memory.excerpt}
              </Text>
              <Link href="/memories/id" asChild>
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="flex-row items-center gap-2 align-middle"
                >
                  <Text className="px-8 font-body text-sm leading-relaxed text-gray-200">
                    Ler mais
                  </Text>
                  <Icon name="arrow-right" size={16} color="#9e9ea0"></Icon>
                </TouchableOpacity>
              </Link>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}
