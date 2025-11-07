import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { formatCurrency, getRelativeTime } from '../utils/dateFormat';

const RecordCard = ({ record, onPress }) => {
  const firstImage = record.imageUrls && record.imageUrls.length > 0 
    ? record.imageUrls[0] 
    : null;

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(record)}
      activeOpacity={0.7}
    >
      {firstImage ? (
        <Image 
          source={{ uri: firstImage }} 
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.noImage}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}
      
      <View style={styles.content}>
        {record.title && (
          <Text style={styles.title} numberOfLines={1}>
            {record.title}
          </Text>
        )}
        
        <Text style={styles.description} numberOfLines={2}>
          {record.description}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.amount}>
            {formatCurrency(record.billAmount)}
          </Text>
          <Text style={styles.date}>
            {getRelativeTime(record.createdAt)}
          </Text>
        </View>
        
        {record.imageUrls && record.imageUrls.length > 1 && (
          <View style={styles.imageCount}>
            <Text style={styles.imageCountText}>
              📷 {record.imageUrls.length} photos
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  noImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#999',
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  imageCount: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  imageCountText: {
    fontSize: 12,
    color: '#666',
  },
});

export default RecordCard;
