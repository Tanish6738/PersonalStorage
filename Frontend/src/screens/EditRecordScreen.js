import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { recordsAPI } from '../services/api';

const EditRecordScreen = ({ route, navigation }) => {
  const { record } = route.params;
  
  const [title, setTitle] = useState(record.title || '');
  const [description, setDescription] = useState(record.description || '');
  const [billAmount, setBillAmount] = useState(record.billAmount.toString());
  const [existingImages, setExistingImages] = useState(record.imageUrls || []);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replaceImages, setReplaceImages] = useState(false);

  const pickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to select images');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 10,
      });

      if (!result.canceled && result.assets) {
        setNewImages(result.assets);
        setReplaceImages(true);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    if (newImages.length === 1) {
      setReplaceImages(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter a description');
      return;
    }

    if (!billAmount || isNaN(billAmount) || parseFloat(billAmount) < 0) {
      Alert.alert('Validation Error', 'Please enter a valid bill amount');
      return;
    }

    if (replaceImages && newImages.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one image');
      return;
    }

    setLoading(true);

    try {
      let formData;

      if (replaceImages && newImages.length > 0) {
        // Create FormData with new images
        formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        formData.append('billAmount', parseFloat(billAmount).toString());

        newImages.forEach((image, index) => {
          const uriParts = image.uri.split('.');
          const fileType = uriParts[uriParts.length - 1];
          
          formData.append('images', {
            uri: image.uri,
            name: `image_${index}.${fileType}`,
            type: `image/${fileType}`,
          });
        });
      } else {
        // Only update text fields
        formData = {
          title: title.trim(),
          description: description.trim(),
          billAmount: parseFloat(billAmount),
        };
      }

      const response = await recordsAPI.update(record._id, formData);

      Alert.alert('Success', 'Record updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error updating record:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update record. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter title..."
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter description..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Bill Amount Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Bill Amount <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              value={billAmount}
              onChangeText={setBillAmount}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Current Images */}
        {!replaceImages && existingImages.length > 0 && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Images</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {existingImages.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={styles.existingImage}
                />
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.changeImagesButton}
              onPress={pickImages}
            >
              <Text style={styles.changeImagesText}>Change Images</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* New Images */}
        {replaceImages && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              New Images <Text style={styles.required}>*</Text>
            </Text>
            
            {newImages.length > 0 ? (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {newImages.map((image, index) => (
                    <View key={index} style={styles.imageContainer}>
                      <Image source={{ uri: image.uri }} style={styles.image} />
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeNewImage(index)}
                      >
                        <Text style={styles.removeButtonText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.addMoreButton}
                  onPress={pickImages}
                >
                  <Text style={styles.addMoreText}>+ Add More Images</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelChangeButton}
                  onPress={() => {
                    setNewImages([]);
                    setReplaceImages(false);
                  }}
                >
                  <Text style={styles.cancelChangeText}>Keep Original Images</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.imagePicker} onPress={pickImages}>
                <Text style={styles.imagePickerIcon}>📷</Text>
                <Text style={styles.imagePickerText}>Select New Images</Text>
                <Text style={styles.imagePickerSubtext}>
                  Tap to select up to 10 images
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Update Record</Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  inputGroup: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  existingImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  changeImagesButton: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 8,
  },
  changeImagesText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  imagePicker: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  imagePickerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  imagePickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 4,
  },
  imagePickerSubtext: {
    fontSize: 14,
    color: '#666',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addMoreButton: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 8,
  },
  addMoreText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelChangeButton: {
    marginTop: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelChangeText: {
    color: '#666',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 32,
  },
});

export default EditRecordScreen;
