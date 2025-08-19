import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// 导入Logo图片
const LogoImage = require('../assets/images/logo.png');

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register, isLoading } = useAuth();

  // 注册流程状态
  const [currentStep, setCurrentStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState({ code: '+86', name: '中国', pattern: /^1[3-9]\d{9}$/ });
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [nickname, setNickname] = useState('');

  // 验证码输入框引用
  const codeInputRefs = useRef<(TextInput | null)[]>([]);

  // 倒计时效果
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // 自动跳转到主页面的效果
  useEffect(() => {
    if (currentStep === 5) {
      const timer = setTimeout(async () => {
        // 注册成功后，通过调用register函数来改变认证状态
        // 这样会自动触发App.tsx中的导航逻辑跳转到Main
        const email = `${phoneNumber}@dancingai.com`; // 生成一个临时邮箱
        const success = await register(nickname, email, '123456'); // 使用临时密码

        if (!success) {
          console.error('注册失败');
        }
      }, 3000); // 3秒后自动跳转
      return () => clearTimeout(timer);
    }
  }, [currentStep, navigation, register, nickname, phoneNumber]);

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  // 处理验证码输入
  const handleCodeInput = (value: string, index: number) => {
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // 自动跳转到下一个输入框
    if (value && index < 3) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  // 处理验证码删除
  const handleCodeKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  // 国家/地区选项
  const countryOptions = [
    { code: '+86', name: '中国', pattern: /^1[3-9]\d{9}$/ },
    { code: '+1', name: '美国', pattern: /^\d{10}$/ },
    { code: '+44', name: '英国', pattern: /^\d{10,11}$/ },
    { code: '+81', name: '日本', pattern: /^\d{10,11}$/ },
    { code: '+82', name: '韩国', pattern: /^\d{9,11}$/ },
    { code: '+65', name: '新加坡', pattern: /^\d{8}$/ },
    { code: '+852', name: '香港', pattern: /^\d{8}$/ },
    { code: '+853', name: '澳门', pattern: /^\d{8}$/ },
    { code: '+886', name: '台湾', pattern: /^\d{9}$/ },
  ];



  // 验证手机号是否有效
  const isPhoneNumberValid = () => {
    if (!phoneNumber) return false;
    const currentCountry = countryOptions.find(c => c.code === selectedCountry.code);
    return currentCountry ? currentCountry.pattern.test(phoneNumber) : false;
  };

  const handleSendCode = () => {
    if (!isPhoneNumberValid()) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }
    // 这里应该调用发送验证码的API
    Alert.alert('提示', '验证码已发送');
    setCountdown(30); // 启动30秒倒计时
    setCurrentStep(3);
  };

  const handleVerifyCode = () => {
    const code = verificationCode.join('');
    if (code.length !== 4) {
      Alert.alert('提示', '请输入完整的验证码');
      return;
    }
    // 模拟验证码验证 (实际应该调用API)
    if (code === '1234') {
      setCurrentStep(4);
    } else {
      Alert.alert('提示', '验证码错误，请重新输入');
      setVerificationCode(['', '', '', '']);
    }
  };



  const handleSetNickname = () => {
    if (!nickname) {
      Alert.alert('提示', '请输入昵称');
      return;
    }
    setCurrentStep(5); // 跳转到"很高兴遇见你"页面
  };



  const renderStep1 = () => (
    <View style={styles.container}>
      {/* Logo在顶部中央 */}
      <View style={styles.logoContainer}>
        <Image source={LogoImage} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.loginButton} onPress={goToLogin}>
          <Text style={styles.loginButtonText}>登录账号</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton} onPress={() => setCurrentStep(2)}>
          <Text style={styles.registerButtonText}>注册账号</Text>
        </TouchableOpacity>

        
        <Image source={require('../assets/images/person_illustration.png')} style={styles.illustrationImage} />
        {/* 图片大小变化 */}
        
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.container}>
      <View style={styles.centeredContainer}>
        {/* Logo在顶部中央 */}
        <View style={styles.logoContainer}>
          <Image source={LogoImage} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentStep(1)}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
        <View style={styles.phoneInputWrapper}>
          <View style={styles.phoneInputContainer}>
            <TouchableOpacity
              style={styles.countrySelector}
              onPress={() => setShowCountryPicker(!showCountryPicker)}
            >
              <Text style={styles.countryCode}>{selectedCountry.code}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TextInput
              style={styles.phoneInput}
              placeholder="请输入手机号码"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          {showCountryPicker && (
            <View style={styles.countryPicker}>
              <ScrollView style={styles.countryPickerScroll} nestedScrollEnabled={true}>
                {countryOptions.map((country) => (
                  <TouchableOpacity
                    key={country.code}
                    style={styles.countryOption}
                    onPress={() => {
                      setSelectedCountry(country);
                      setShowCountryPicker(false);
                      setPhoneNumber(''); // 清空手机号
                    }}
                  >
                    <Text style={styles.countryOptionText}>
                      {country.code} {country.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            isPhoneNumberValid() ? styles.primaryButtonActive : styles.primaryButtonInactive
          ]}
          onPress={handleSendCode}
          disabled={!isPhoneNumberValid()}
        >
          <Text style={[
            styles.primaryButtonText,
            isPhoneNumberValid() ? styles.primaryButtonTextActive : styles.primaryButtonTextInactive
          ]}>
            获取验证码
          </Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.container}>
      <View style={styles.centeredContainer}>
        {/* Logo在顶部中央 */}
        <View style={styles.logoContainer}>
          <Image source={LogoImage} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentStep(2)}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
        <Text style={styles.verificationSentText}>
          验证码已发送至    {selectedCountry.code} {phoneNumber}
        </Text>

        <View style={styles.codeInputContainer}>
          {verificationCode.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (codeInputRefs.current[index] = ref)}
              style={styles.codeInput}
              value={digit}
              onChangeText={(value) => handleCodeInput(value, index)}
              onKeyPress={({ nativeEvent }) => handleCodeKeyPress(nativeEvent.key, index)}
              maxLength={1}
              keyboardType="numeric"
              textAlign="center"
              autoFocus={index === 0}
            />
          ))}
        </View>

        <View style={styles.codeFooter}>
          <TouchableOpacity
            onPress={() => {
              if (countdown === 0) {
                Alert.alert('提示', '验证码已重新发送');
                setCountdown(30); // 重新启动倒计时
              }
            }}
            disabled={countdown > 0}
          >
            <Text style={[styles.resendText, countdown > 0 && styles.resendTextDisabled]}>
              没有收到验证码？
            </Text>
          </TouchableOpacity>
          <Text style={styles.countdownText}>
            {countdown > 0 ? `${countdown}s后可重新获取` : '可重新获取'}
          </Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleVerifyCode}>
          <Text style={styles.primaryButtonText}>验证</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.container}>
      {/* Logo在顶部中央 */}
      <View style={styles.logoContainer}>
        <Image source={LogoImage} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentStep(3)}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.questionTitle}>怎么称呼你?</Text>
        
        <TextInput
          style={styles.nicknameInput}
          placeholder="请输入昵称"
          value={nickname}
          onChangeText={setNickname}
        />
        
        <TouchableOpacity
          style={[
            styles.primaryButton,
            nickname ? styles.nicknameButtonActive : styles.primaryButtonInactive
          ]}
          onPress={handleSetNickname}
          disabled={!nickname}
        >
          <Text style={[
            styles.primaryButtonText,
            nickname ? styles.primaryButtonTextActive : styles.primaryButtonTextInactive
          ]}>
            继续
          </Text>
        </TouchableOpacity>
        
        <Image source={require('../assets/images/cat_illustration.png')} style={styles.illustrationImage} />
      </View>
    </View>
  );

  // "很高兴遇见你"页面
  const renderStep5 = () => (
    <View style={styles.welcomeContainer}>
      <View style={styles.welcomeContent}>
        <Image
          source={require('../assets/images/nice_to_meet_you.png')}
          style={styles.welcomeTitleImageLarge}
          resizeMode="contain"
        />

        <Image
          source={require('../assets/images/last_person.png')}
          style={styles.lastPageIllustration}
          resizeMode="contain"
        />
      </View>
    </View>
  );


  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5(); // 很高兴遇见你页面，然后自动跳转到首页
      default: return renderStep1();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderCurrentStep()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5DC', // 与其他界面保持一致
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // 与其他界面保持一致
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    fontSize: 24,
    color: '#333',
    marginRight: 20,
  },
  logo: {
    height: 100,  // 进一步放大logo
    width: 300,
  },
  logoImage: {
    height: 60,
    width: 180,
  },
  illustrationImage: {
    height: 330,  // 人物图片稍微调小
    width: 330,
    alignSelf: 'center',
    marginTop: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  loginButton: {
    backgroundColor: '#333',
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#E8FFBD',
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 30,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#FFE66E',
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 30,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonActive: {
    backgroundColor: '#FFD66E', // 修改为FFD66E
  },
  primaryButtonInactive: {
    backgroundColor: '#ccc', // 灰色
  },
  primaryButtonTextActive: {
    color: '#333',
  },
  primaryButtonTextInactive: {
    color: '#666',
  },
  nicknameButtonActive: {
    backgroundColor: '#E8FFBD', // 浅绿色
  },
  verificationSentText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  codeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  resendText: {
    fontSize: 14,
    color: '#4A90E2',
  },
  resendTextDisabled: {
    color: '#999',
  },
  countdownText: {
    fontSize: 14,
    color: '#999',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  phoneInputWrapper: {
    marginBottom: 20,
    position: 'relative',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    minWidth: 80,
  },
  separator: {
    width: 1,
    height: 30,
    backgroundColor: '#ddd',
  },
  countryCode: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  countryPicker: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  countryPickerScroll: {
    maxHeight: 200,
  },
  countryOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  countryOptionText: {
    fontSize: 16,
    color: '#333',
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  codeInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15, // 圆角正方形
    textAlign: 'center',
    fontSize: 24,
    backgroundColor: '#f9f9f9',
  },
  codeHint: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  nicknameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  avatarOption: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatar: {
    borderColor: '#FFE66E',
    backgroundColor: '#FFF9E6',
  },
  avatarPlaceholder: {
    fontSize: 30,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 50,
  },
  illustrationContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  illustrationPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  placeholderNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  // 欢迎页面样式
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#F5F5DC', // 与其他界面保持一致
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
    justifyContent: 'space-evenly', // 均匀分布两张图片
    flex: 1, // 占满整个容器
    paddingVertical: 60, // 添加上下内边距
  },
  welcomeTitleImage: {
    width: 200,
    height: 80,
    marginBottom: 40,
  },
  // 最后一页的大标题图片 (缩小一些)
  welcomeTitleImageLarge: {
    width: 250, // 适当缩小
    height: 100, // 适当缩小
    marginBottom: 30, // 减少底部间距
  },
  // 最后一页的大人物图片 (完整显示整个人)
  lastPageIllustration: {
    width: '70%', // 适当缩小宽度
    height: undefined, // 高度自适应，保持原始比例
    aspectRatio: undefined, // 让图片保持原始宽高比
    alignSelf: 'center',
    marginTop: 10, // 减少顶部间距
    maxWidth: 300, // 减少最大宽度
    maxHeight: 350, // 添加最大高度限制
  },
  characterPlaceholder: {
    width: 250,
    height: 300,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  catPlaceholder: {
    width: 200,
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
});

export default RegisterScreen;
