import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, API_BASE_URL } from '../../utils/constants';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function DebugScreen({ navigation }) {
  const { user, token, isAuthenticated } = useAuth();
  const [testResults, setTestResults] = useState({});

  const runTest = async (name, testFn) => {
    try {
      const result = await testFn();
      setTestResults(prev => ({ ...prev, [name]: { success: true, data: result } }));
      return result;
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [name]: { 
          success: false, 
          error: error.message,
          details: error.response?.data 
        } 
      }));
      throw error;
    }
  };

  const tests = [
    {
      name: 'Backend Health',
      test: async () => {
        const response = await api.get('/health');
        return response.data;
      }
    },
    {
      name: 'Auth Status',
      test: async () => {
        return {
          isAuthenticated,
          hasToken: !!token,
          hasUser: !!user,
          userId: user?.id,
          userEmail: user?.email
        };
      }
    },
    {
      name: 'Get Properties',
      test: async () => {
        const response = await api.get('/properties');
        return { count: response.data?.length, sample: response.data?.[0] };
      }
    },
    {
      name: 'Get Favorites',
      test: async () => {
        const response = await api.get('/favorites');
        return { count: response.data?.length };
      }
    },
    {
      name: 'Get My Properties',
      test: async () => {
        const response = await api.get('/properties/user/my-properties');
        return { count: response.data?.length };
      }
    }
  ];

  const runAllTests = async () => {
    setTestResults({});
    for (const test of tests) {
      try {
        await runTest(test.name, test.test);
      } catch (error) {
        console.error(`Test "${test.name}" failed:`, error);
      }
    }
    Alert.alert('Tests Complete', 'Check results below');
  };

  const getStatusIcon = (testName) => {
    const result = testResults[testName];
    if (!result) return { name: 'help-circle-outline', color: COLORS.gray };
    if (result.success) return { name: 'checkmark-circle', color: COLORS.success };
    return { name: 'close-circle', color: COLORS.danger };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Debug & Tests</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuration</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>API Base URL:</Text>
            <Text style={styles.infoValue}>{API_BASE_URL}</Text>
            
            <Text style={styles.infoLabel}>Auth Token:</Text>
            <Text style={styles.infoValue}>
              {token ? `${token.substring(0, 20)}...` : 'None'}
            </Text>
            
            <Text style={styles.infoLabel}>User ID:</Text>
            <Text style={styles.infoValue}>{user?.id || 'Not logged in'}</Text>
            
            <Text style={styles.infoLabel}>User Email:</Text>
            <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
          </View>
        </View>

        {/* Run Tests */}
        <TouchableOpacity style={styles.runButton} onPress={runAllTests}>
          <Ionicons name="play-circle" size={24} color={COLORS.white} />
          <Text style={styles.runButtonText}>Run All Tests</Text>
        </TouchableOpacity>

        {/* Test Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Results</Text>
          {tests.map((test) => {
            const icon = getStatusIcon(test.name);
            const result = testResults[test.name];
            
            return (
              <View key={test.name} style={styles.testCard}>
                <View style={styles.testHeader}>
                  <Ionicons name={icon.name} size={24} color={icon.color} />
                  <Text style={styles.testName}>{test.name}</Text>
                </View>
                {result && (
                  <View style={styles.testResult}>
                    {result.success ? (
                      <Text style={styles.successText}>
                        {JSON.stringify(result.data, null, 2)}
                      </Text>
                    ) : (
                      <>
                        <Text style={styles.errorText}>Error: {result.error}</Text>
                        {result.details && (
                          <Text style={styles.detailsText}>
                            {JSON.stringify(result.details, null, 2)}
                          </Text>
                        )}
                      </>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: COLORS.light,
    borderRadius: 10,
    padding: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 10,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '600',
    marginTop: 2,
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    gap: 10,
  },
  runButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  testCard: {
    backgroundColor: COLORS.light,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
  },
  testResult: {
    marginTop: 10,
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 5,
  },
  successText: {
    fontSize: 12,
    color: COLORS.success,
    fontFamily: 'monospace',
  },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: '600',
  },
  detailsText: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 5,
    fontFamily: 'monospace',
  },
});
