import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { formatCurrency, formatDate } from '../utils/dateFormat';
import { recordsAPI } from '../services/api';
import ImageViewer from '../components/ImageViewer';

const { width } = Dimensions.get('window');

const RecordDetailScreen = ({ route, navigation }) => {
  const { record } = route.params;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [viewerInitialIndex, setViewerInitialIndex] = useState(0);

  const handleDelete = () => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this record? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await recordsAPI.delete(record._id);
              Alert.alert('Success', 'Record deleted successfully', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              console.error('Error deleting record:', error);
              Alert.alert('Error', 'Failed to delete record');
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const openImageViewer = (index) => {
    setViewerInitialIndex(index);
    setImageViewerVisible(true);
  };

  const renderImagePagination = () => {
    if (!record.imageUrls || record.imageUrls.length <= 1) return null;

    return (
      <View style={styles.pagination}>
        {record.imageUrls.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentImageIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Image Carousel */}
        {record.imageUrls && record.imageUrls.length > 0 && (
          <View style={styles.imageSection}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / width
                );
                setCurrentImageIndex(index);
              }}
            >
              {record.imageUrls.map((url, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.9}
                  onPress={() => openImageViewer(index)}
                >
                  <Image
                    source={{ uri: url }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  {/* Fullscreen Icon Hint */}
                  <View style={styles.fullscreenHint}>
                    <Text style={styles.fullscreenHintText}>🔍 Tap to view fullscreen</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {renderImagePagination()}
            
            {record.imageUrls.length > 1 && (
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {currentImageIndex + 1} / {record.imageUrls.length}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Record Details */}
        <View style={styles.content}>
          {/* Title */}
          {record.title && (
            <Text style={styles.title}>{record.title}</Text>
          )}

          {/* Bill Amount */}
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Bill Amount</Text>
            <Text style={styles.amount}>
              {formatCurrency(record.billAmount)}
            </Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.description}>{record.description}</Text>
          </View>

          {/* Date */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Created On</Text>
            <Text style={styles.date}>{formatDate(record.createdAt)}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => navigation.navigate('EditRecord', { record })}
            >
              <Text style={styles.buttonIcon}>✏️</Text>
              <Text style={styles.buttonText}>Edit Record</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.buttonIcon}>🗑️</Text>
                  <Text style={styles.buttonText}>Delete Record</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Image Viewer Modal */}
      <ImageViewer
        visible={imageViewerVisible}
        imageUrls={record.imageUrls || []}
        initialIndex={viewerInitialIndex}
        onClose={() => setImageViewerVisible(false)}
      />
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
  imageSection: {
    position: 'relative',
  },
  image: {
    width: width,
    height: width * 0.75,
    backgroundColor: '#f0f0f0',
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  imageCounter: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  fullscreenHint: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fullscreenHintText: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  amountContainer: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  date: {
    fontSize: 16,
    color: '#333',
  },
  actions: {
    marginTop: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: '#2563eb',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 32,
  },
});

export default RecordDetailScreen;
