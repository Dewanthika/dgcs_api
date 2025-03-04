import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const saltOrRounds = 10;
  return await bcrypt.hash(password, saltOrRounds);
  // try {
    
  // } catch (error) {
  //   console.error('Error hashing password', error);
  //   //throw new Error('Error hashing password');
  // }
};

export const isPasswordMatch = async (
  password: string,
  hashedPassword: string,
) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords', error);
    return false;
  }
};
