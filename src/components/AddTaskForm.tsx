"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Picker } from "@react-native-picker/picker"
import type { Task } from "../types"
import { useTheme } from "../context/ThemeContext"

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, "id" | "createdAt" | "completed">) => void
  editingTask?: Task
  onCancelEdit?: () => void
}

export function AddTaskForm({ onAddTask, editingTask, onCancelEdit }: AddTaskFormProps) {
  const { currentTheme } = useTheme()
  const [isModalVisible, setIsModalVisible] = useState(!!editingTask)
  const [title, setTitle] = useState(editingTask?.title || "")
  const [description, setDescription] = useState(editingTask?.description || "")
  const [priority, setPriority] = useState<"low" | "medium" | "high">(editingTask?.priority || "medium")
  const [category, setCategory] = useState(editingTask?.category || "Personal")

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a task title")
      return
    }

    onAddTask({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category,
    })

    // Reset form
    setTitle("")
    setDescription("")
    setPriority("medium")
    setCategory("Personal")
    setIsModalVisible(false)

    if (onCancelEdit) {
      onCancelEdit()
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    if (onCancelEdit) {
      onCancelEdit()
    }
  }

  const styles = StyleSheet.create({
    addButton: {
      backgroundColor: currentTheme.colors.primary,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginBottom: 16,
    },
    addButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 16,
      padding: 20,
      width: "90%",
      maxHeight: "80%",
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: currentTheme.colors.text,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: currentTheme.colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    formGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: currentTheme.colors.text,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: currentTheme.colors.primary + "40",
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: currentTheme.colors.text,
      backgroundColor: currentTheme.colors.background,
    },
    textArea: {
      height: 80,
      textAlignVertical: "top",
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: currentTheme.colors.primary + "40",
      borderRadius: 8,
      backgroundColor: currentTheme.colors.background,
    },
    picker: {
      color: currentTheme.colors.text,
    },
    row: {
      flexDirection: "row",
      gap: 12,
    },
    halfWidth: {
      flex: 1,
    },
    buttonRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: 20,
    },
    submitButton: {
      flex: 1,
      backgroundColor: currentTheme.colors.primary,
      borderRadius: 8,
      padding: 16,
      alignItems: "center",
    },
    submitButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    cancelButton: {
      backgroundColor: currentTheme.colors.background,
      borderWidth: 1,
      borderColor: currentTheme.colors.primary + "40",
      borderRadius: 8,
      padding: 16,
      alignItems: "center",
      minWidth: 80,
    },
    cancelButtonText: {
      color: currentTheme.colors.text,
      fontSize: 16,
      fontWeight: "600",
    },
  })

  if (!isModalVisible && !editingTask) {
    return (
      <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
        <Ionicons name="add" size={20} color="white" />
        <Text style={styles.addButtonText}>Add New Task</Text>
      </TouchableOpacity>
    )
  }

  return (
    <Modal visible={isModalVisible || !!editingTask} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editingTask ? "Edit Task" : "Add New Task"}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
              <Ionicons name="close" size={20} color={currentTheme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Task Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="What needs to be done?"
                placeholderTextColor={currentTheme.colors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Add more details..."
                placeholderTextColor={currentTheme.colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={priority} onValueChange={(value) => setPriority(value)} style={styles.picker}>
                    <Picker.Item label="📝 Low" value="low" />
                    <Picker.Item label="⚡ Medium" value="medium" />
                    <Picker.Item label="🔥 High" value="high" />
                  </Picker>
                </View>
              </View>

              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={category} onValueChange={(value) => setCategory(value)} style={styles.picker}>
                    <Picker.Item label="🏠 Personal" value="Personal" />
                    <Picker.Item label="💼 Work" value="Work" />
                    <Picker.Item label="💪 Health" value="Health" />
                    <Picker.Item label="📚 Learning" value="Learning" />
                    <Picker.Item label="🛒 Shopping" value="Shopping" />
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>{editingTask ? "Update Task" : "Add Task"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}
