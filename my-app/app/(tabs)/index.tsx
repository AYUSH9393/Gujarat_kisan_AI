// mobile-app/app/(tabs)/index.tsx
// Updated with back button and proper language handling

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { apiService } from '../../services/api';



export default function HomeScreen() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false); // Track if showing answer page
  const router = useRouter();

  // Test connection on app start
  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    const isConnected = await apiService.testConnection();
    setConnected(isConnected);
    if (!isConnected) {
      Alert.alert(
        'Backend Not Connected',
        'Make sure your backend is running on the same Wi-Fi network'
      );
    }
  };

  // Detect language of the question
  const detectLanguage = (text: string): string => {
    // Check if text contains Gujarati characters
    const gujaratiRegex = /[\u0A80-\u0AFF]/;
    if (gujaratiRegex.test(text)) {
      return 'gujarati';
    }
    return 'english';
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      Alert.alert('Empty Question', 'Please type your question first');
      return;
    }

    setLoading(true);
    setAnswer('');

    try {
      // Detect language automatically
      const detectedLanguage = detectLanguage(question);
      
      const response = await apiService.askQuestion({
        question: question,
        language: detectedLanguage
      });
      
      setAnswer(response.answer);
      setShowAnswer(true); // Show answer page
    } catch (error) {
      Alert.alert(
        'Error',
        'Could not get response. Make sure backend is running.'
      );
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    setShowAnswer(false);
    setQuestion('');
    setAnswer('');
  };

  // Answer Page View
  if (showAnswer) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f0fdf4' }}>
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            {/* Back Button Header - Moved below status bar */}
            <View style={styles.answerHeader}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleBackToHome}
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Answer</Text>
              <View style={styles.placeholder} />
            </View>
            {/* Question Display */}
            <View style={styles.questionDisplayCard}>
              <Text style={styles.questionLabel}>Your Question:</Text>
              <Text style={styles.questionDisplayText}>{question}</Text>
            </View>

            {/* Answer Display */}
            <View style={styles.answerCard}>
              <Text style={styles.answerTitle}>📝 Answer:</Text>
              <Text style={styles.answerText}>{answer}</Text>
            </View>

            {/* Ask Another Button */}
            <TouchableOpacity 
              style={styles.askAnotherButton}
              onPress={handleBackToHome}
            >
              <Text style={styles.askAnotherButtonText}>Ask Another Question</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Home Page View (Question Input)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🌾 Gujarat Kisan AI</Text>
            <Text style={styles.subtitle}>ગુજરાત કિસાન સહાયક</Text>
            
            {/* Connection Status */}
            <View style={[styles.statusBadge, { backgroundColor: connected ? '#dcfce7' : '#fee2e2' }]}>
              <Text style={[styles.statusText, { color: connected ? '#166534' : '#991b1b' }]}>
                {connected ? '✓ Connected' : '✗ Not Connected'}
              </Text>
            </View>
          </View>

          {/* Ask Question Card */}
          <View style={styles.askCard}>
            <Text style={styles.askTitle}>💬 Ask Your Question</Text>
            <Text style={styles.askSubtitle}>
              પૂછો તમારો સવાલ (in Gujarati or English)
            </Text>
            {/* <Text style={styles.languageHint}>
              💡 Type in any language - we'll detect it automatically!
            </Text> */}
            
            <TextInput
              style={styles.questionInput}
              value={question}
              onChangeText={setQuestion}
              placeholder="e.g., મારા કપાસમાં સફેદ માખી છે (My cotton has whitefly)"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              editable={!loading}
            />
            
            <TouchableOpacity 
              style={[styles.askButton, loading && styles.askButtonDisabled]}
              onPress={handleAskQuestion}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="white" />
                  <Text style={styles.loadingText}>Getting answer...</Text>
                </View>
              ) : (
                <Text style={styles.askButtonText}>Ask AI Assistant ✨</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Quick Actions - These will be real features */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => Alert.alert('Coming Soon', 'Camera feature on Day 7-8!')}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>📸</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Scan Crop Disease</Text>
              <Text style={styles.actionDesc}>Take photo to identify problems</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => Alert.alert('Coming Soon', 'Market prices on Day 9-10!')}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>📈</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Today's Market Prices</Text>
              <Text style={styles.actionDesc}>Live rates from Gujarat mandis</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => Alert.alert('Coming Soon', 'Weather on Day 11!')}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>🌤️</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Weather Forecast</Text>
              <Text style={styles.actionDesc}>7-day forecast for your area</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          {/* Example Questions */}
          <Text style={styles.sectionTitle}>Try These Questions:</Text>
          
          <TouchableOpacity 
            style={styles.exampleCard}
            onPress={() => setQuestion('મારા કપાસમાં સફેદ માખી છે શું કરું?')}
            disabled={loading}
          >
            <Text style={styles.exampleText}>
              મારા કપાસમાં સફેદ માખી છે શું કરું?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.exampleCard}
            onPress={() => setQuestion('What is the best fertilizer for groundnut in Gujarat?')}
            disabled={loading}
          >
            <Text style={styles.exampleText}>
              What is the best fertilizer for groundnut in Gujarat?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.exampleCard}
            onPress={() => setQuestion('કપાસ ક્યારે વાવવો જોઈએ?')}
            disabled={loading}
          >
            <Text style={styles.exampleText}>
              કપાસ ક્યારે વાવવો જોઈએ?
            </Text>
          </TouchableOpacity>

          {/* Troubleshooting */}
          {!connected && (
            <View style={styles.troubleshootCard}>
              <Text style={styles.troubleshootTitle}>⚠️ Troubleshooting</Text>
              <Text style={styles.troubleshootText}>
                1. Make sure backend is running{'\n'}
                2. Check if on same Wi-Fi{'\n'}
                3. Verify IP address in api.ts{'\n'}
                4. Try: npx expo start --tunnel
              </Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={testConnection}
              >
                <Text style={styles.retryButtonText}>Retry Connection</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  content: {
    padding: 16,
  },
  
  // Header Styles
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#166534',
  },
  subtitle: {
    fontSize: 20,
    color: '#16a34a',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Action Card Styles
  actionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 13,
    color: '#6b7280',
  },
  arrow: {
    fontSize: 20,
    color: '#16a34a',
  },

  // Ask Card Styles
  askCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  askTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 4,
  },
  askSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  languageHint: {
    fontSize: 12,
    color: '#16a34a',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  questionInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  askButton: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  askButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  askButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: 'white',
    fontSize: 14,
  },

  // Answer Page Styles
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40, // Added extra padding to avoid status bar
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#16a34a',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#166534',
  },
  placeholder: {
    width: 60, // Balance the header
  },
  answerContainer: {
    flex: 1,
  },
  questionDisplayCard: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
  },
  questionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  questionDisplayText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  answerCard: {
    backgroundColor: '#dcfce7',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  answerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 12,
  },
  answerText: {
    fontSize: 16,
    color: '#166534',
    lineHeight: 26,
  },
  askAnotherButton: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  askAnotherButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Example Card Styles
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
  },
  exampleCard: {
    backgroundColor: '#f0fdf4',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#16a34a',
  },
  exampleText: {
    fontSize: 14,
    color: '#166534',
  },

  // Troubleshoot Styles
  troubleshootCard: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  troubleshootTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  troubleshootText: {
    fontSize: 13,
    color: '#78350f',
    lineHeight: 20,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#f59e0b',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});