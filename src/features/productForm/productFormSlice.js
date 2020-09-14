import { createSlice } from '@reduxjs/toolkit';

export const productFormSlice = createSlice({
  name: 'productForm',
  initialState: {
    productList: []
  },
  reducers: {
    addToList:(state,action) =>{
      var product = action.payload;

      //calculate email dates, push for each email date
      var activationDate = stringToDate(product.startDate);
      var tempDate = new Date(activationDate);
      var expirationDate = new Date(tempDate.setMonth(tempDate.getMonth() + product.durationMonths))

      switch(product.productName){
        case "domain":
        case "pdomain":
        case "edomain":
          var expirationEmailDate = changeByXDays(expirationDate, -2);

          product.emailDate = datetoString(expirationEmailDate);
          state.productList.push(product);
          break;
        case "hosting":
          var activationEmailDate = changeByXDays(expirationDate, 1);
          var expirationEmailDate = changeByXDays(expirationDate, -3);

          product.emailDate = datetoString(activationEmailDate);
          state.productList.push(product);

          product.emailDate = datetoString(expirationEmailDate);
          state.productList.push(product);
          break;
        case "email":
          var expirationEmailDate = changeByXDays(expirationDate, -1);

          product.emailDate = datetoString(expirationEmailDate);
          state.productList.push(product);
          break;
        default:
          //do nothing.  should not exist
          break;
      }
    }
  },
});

function stringToDate(givenDate){
  var parts = givenDate.split('-');
  // Pay attention to the month (parts[1]); JavaScript counts months from 0:
  // January - 0, February - 1, etc.
  var convertedDate = new Date(parts[0], parts[1] - 1, parts[2]);
  return convertedDate;
}

function changeByXDays(givenDate, daysToChange){
  return new Date(givenDate.setDate(givenDate.getDate() + daysToChange));
}

function datetoString(givenDate){
  var dd = givenDate.getDate();
  var mm = givenDate.getMonth() + 1; //January is 0!
  var yyyy = givenDate.getFullYear();
  if(dd<10){
      dd='0'+dd
  } 
  if(mm<10){
      mm='0'+mm
  }

  var formattedDate = yyyy+'-'+mm+'-'+dd;
  return formattedDate
}

export const { addToList } = productFormSlice.actions;

export const selectProductList = state => state.productForm.productList

export default productFormSlice.reducer;
