import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  TextInput as RNTextInput,
} from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  style?: any;
}

export function Button({
  onPress,
  title,
  loading,
  disabled,
  variant = 'primary',
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
        disabled || loading ? styles.disabledButton : {},
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#5C7CFA'} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            variant === 'primary' ? styles.primaryText : styles.secondaryText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

interface TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  placeholderTextColor?: string;
  style?: any;
  keyboardType?: any;
}

export function TextInput({
  placeholder,
  value,
  onChangeText,
  placeholderTextColor = '#AAB2C1',
  style,
  ...rest
}: TextInputProps) {
  return (
    <RNTextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      value={value}
      onChangeText={onChangeText}
      {...rest}
    />
  );
}

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
}

export function Card({ children, onPress }: CardProps) {
  if (onPress) {
    return (
      <TouchableOpacity style={styles.card} onPress={onPress}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={styles.card}>{children}</View>;
}

interface LoadingProps {
  message?: string;
}

export function Loading({ message }: LoadingProps) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size='large' color='#5C7CFA' />
      {message && <Text style={styles.loadingText}>{message}</Text>}
    </View>
  );
}

interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorProps) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>⚠️ {message}</Text>
      {onRetry && <Button title='Retry' onPress={onRetry} variant='secondary' style={{ marginTop: 10, borderColor: '#FF6B6B' }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  primaryButton: {
    backgroundColor: '#5C7CFA',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#5C7CFA',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    color: '#1E1E1E',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#868E96',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#FFE3E3',
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
    fontWeight: '600',
  },
});
