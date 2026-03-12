import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  TextInput as RNTextInput,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../lib/ThemeContext';

interface ButtonProps {
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
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
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 375;
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' 
          ? { backgroundColor: colors.primary } 
          : variant === 'danger'
          ? { backgroundColor: colors.error }
          : { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
        isSmallDevice ? { paddingVertical: 10 } : {},
        disabled || loading ? { opacity: 0.5 } : {},
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.primary : '#FFFFFF'} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            variant === 'primary' || variant === 'danger'
              ? { color: '#FFFFFF' } 
              : { color: colors.primary },
            isSmallDevice ? { fontSize: 14 } : {},
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
  placeholderTextColor,
  style,
  ...rest
}: TextInputProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 375;
  
  return (
    <RNTextInput
      style={[
        styles.input, 
        { 
          borderColor: colors.border, 
          backgroundColor: colors.inputBg, 
          color: colors.text,
          paddingVertical: isSmallDevice ? 10 : 12,
          fontSize: isSmallDevice ? 14 : 16,
        }, 
        style
      ]}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor || colors.textDim}
      value={value}
      onChangeText={onChangeText}
      {...rest}
    />
  );
}

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
}

export function Card({ children, onPress, style }: CardProps) {
  const { colors, isDark } = useTheme();
  
  const content = (
    <View style={[
      styles.card, 
      { 
        backgroundColor: colors.surface, 
        borderColor: colors.border,
        shadowColor: isDark ? '#000' : '#495057',
      }, 
      style
    ]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

interface LoadingProps {
  message?: string;
}

export function Loading({ message }: LoadingProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
      <ActivityIndicator size='large' color={colors.primary} />
      {message && <Text style={[styles.loadingText, { color: colors.textDim }]}>{message}</Text>}
    </View>
  );
}

interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.errorContainer, { backgroundColor: colors.errorBg, borderColor: colors.error + '40' }]}>
      <Text style={[styles.errorText, { color: colors.error }]}>⚠️ {message}</Text>
      {onRetry && (
        <Button 
          title='Retry' 
          onPress={onRetry} 
          variant='secondary' 
          style={{ marginTop: 10, borderColor: colors.error }} 
        />
      )}
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
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    fontSize: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '500',
  },
  errorContainer: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
});
