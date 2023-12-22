import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
// Define your color variables
const colors = {
 
  tertiaryText: "#999",
  primaryBackground: "#165882FF",
  secondaryBackground: "#165882FF",
  buttonBackground: "#25D366",
  white: "#ffffff",
  inputBackground: "#165882FF",
  // -------------
  primaryText: "#DE0075",
  primaryLight: "#f5faaf",
  secondaryText: "#FAF9F6",
  darkestBlue:'#f5f5f5',
  darkBlue:'#ECF87F',
  lightBlue:'#d7dee7',

  darkPink:'#e43781',
  pink:'#DE0075',
  lightPink:'#f7fbba',
  darkestOliveGreen:'#3F4122',
  darkOlive:'#6e7a38',
  olive:'#879154',
  lightOlive:'#DE0075',
  deepBlue:'#12486B',

  // ----------------
maroon:'#a8004b',
ligthGray:'#F3F2F7',
darkGray:'#48484b',
matBlack:'#141414',
// ------------------------
// primaryText: "#ECF87F",
// primaryLight: "#f5faaf",
// secondaryText: "#FAF9F6",
// darkestBlue:'#4B5320',
// darkBlue:'#6F7A2F',
// lightBlue:'#d7dee7',

// darkPink:'#e43781',
// pink:'#DE0075',
// darkestOliveGreen:'#3F4122',
// darkOlive:'#6e7a38',
// olive:'#879154',
// lightOlive:'#cfd2b8',
// ---------------
  // primaryText: "#1BCCBA",
  // darkestBlue:'#12486B',
  // darkBlue:'#165882FF',
  // lightBlue:'#d7dee7',
  fontStyle :'',
};

const globalStyles = StyleSheet.create({
   input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    color: colors.matBlack,
    fontSize: 16,
    borderBottomColor: colors.pink,
    borderBottomWidth: 2,
  },
  headerText: {
    fontSize: screenWidth * 0.055,
    color: colors.pink,
    fontWeight: 'bold',
    marginBottom: screenWidth * 0.045,
    textAlign: 'center',
},
  centralisingContainer:{
flex: 1,
alignItems: 'center',
justifyContent: 'center',
  },
  // Text Styles
  textPrimary: {
    color:colors.primaryText,
    fontSize: screenWidth * 0.047,
    // fontWeight: 'bold',
    marginBottom: 1,
    marginLeft:2,
  },
  textSecondary: {
    // color:"#820000",
    color:"#12486B",
    // color:colors.secondaryText,
    fontSize: screenWidth * 0.039,
    fontWeight: 'bold',
    marginBottom: 5,
    flex: 1,
  },
  textTertiary: {
    fontSize: screenWidth * 0.031,
    color: '#999',
    marginBottom: 3,
  },
  
  // Container Styles
  containerPrimary: {
    flex: 1,
    // backgroundColor: colors.pink,
    backgroundColor: "#d0006a",
    // backgroundColor: colors.darkestOliveGreen,
    // padding: 10,
  },
  containerSecondary: {
    // padding: 10,
    backgroundColor: colors.darkBlue,
    // marginVertical: 10,
  },
  displayTextContainer: {
    backgroundColor:colors.darkBlue,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    position: 'relative',
    borderBottomColor:colors.pink,
    borderBottomWidth:2,
    
  },
  displayText:{
    fontSize: 19,
    color: colors.pink,
    fontWeight: 'bold',
  },
  // Button Styles
  button: {
    backgroundColor: 'whitesmoke',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export { globalStyles, colors };
