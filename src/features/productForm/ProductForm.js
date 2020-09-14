import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addToList,
  selectProductList
} from './productFormSlice';
import styles from './ProductForm.css';

export function ProductForm() {
  const productList = useSelector(selectProductList);

  const dispatch = useDispatch();
  
  const [customerID, setCustomerID] = useState("");
  const [productName, setProductName] = useState("");
  const [domain, setDomain] = useState("");
  const [startDate, setStartDate] = useState(setMinimumDate(new Date()));
  const [durationMonths, setDurationMonths] = useState("0");

  const [productSubmissionStyle, setProductSubmissionStyle] = useState("ADDPRODUCT");
  const [productListSortOrder, setProductListSortOrder] = useState("LISTBYPRODUCTS");

  const [disableSubmit, setDisableSubmit] = useState(true);
  const [isError, setIsError] = useState({});
  
  function setMinimumDate(givenDate){
    var dd = givenDate.getDate();
    var mm = givenDate.getMonth()+1; //January is 0!
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

  function buildProduct(){
    const newProduct = {
      "customerID": customerID,
      "productName": productName,
      "domain": domain,
      "startDate": startDate,
      "durationMonths": durationMonths}

    return newProduct
  }

  function validate(e){
      const name = e.target.name;
      const value = e.target.value;

      var customerIDError = isError.customerID || "";
      var productNameError = isError.productName || "";
      var domainError = isError.domain || "";
      var startDateError = isError.startDate || "";
      var durationMonthsError = isError.durationMonths || "";

      switch (name) {
          case "customerID":
            setCustomerID(value);
            customerIDError =
              value.length < 1 ? "At least 1 character required" : "";
            break;
          case "productName":
            setProductName(value);
            productNameError = ((value === "domain")
            || (value === "hosting")
            || (value === "email")
            || (value === "pdomain")
            || (value === "edomain")) ? "" : "Valid products are: domain, hosting, email, pdomain, edomain";
            break;
          case "domain":
            setDomain(value);
            switch(productName){
              case "domain":
              case "pdomain":
                var patt = /(.*[.]com)|(.*[.]org)/g;
                domainError = value.match(patt) ? "" : "Only .com and .org top-level domains are supported";
                break;
              case "hosting":
              case "email":
                //no other requirements specific to these mentioned
                break;
              case "edomain":
                var patt = /(.*[.]edu)/g;
                domainError = value.match(patt) ? "" : "Only .edu domains are supported";
                break;
              default:
                domainError = "Unrecognized product"
                break;
            }
            break;
          case "startDate":
            setStartDate(value);
            if (productSubmissionStyle === "LOADPRODUCT"){
              //handled by code already.  date part of form always has value
            }
            break;
          case "durationMonths":
            setDurationMonths(value);
            switch(productName){
              case "domain":
              case "pdomain":
              case "edomain":
                //value must be multiple of 12
                durationMonthsError = value % 12 === 0? "" : "Value must be a multiple of 12"
                break;
              case "hosting":
              case "email":
                //handled by code already.  all values are positive multiples of 1
                break;
              default:
                durationMonthsError = "Unrecognized product"
                break;
            }
            break;
          default:
              break;
      }

      setIsError({
        customerID: customerIDError,
        productName: productNameError,
        domain: domainError,
        startDate: startDateError,
        durationMonths: durationMonthsError
      });
  }

  useEffect(() => {
    if (isError?.customerID?.length <= 0
      && isError?.productName?.length <= 0
      && isError?.domain?.length <= 0
      && isError?.durationMonths?.length <= 0  //not being picked up
      && customerID.length > 0
      && productName.length > 0
      && domain.length > 0
      && startDate.length > 0
      // && durationMonths.length > 0 //not being picked up, but alert catches length
      // && durationMonths > 0 //not being picked up, but alert catches value
      ) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  }, [isError]);

  return (
    <div>
      <div>
        <div className="radio">
          <input type="radio" value="ADDPRODUCT" name = "Product Submission Style"
                        onClick={e => setProductSubmissionStyle(e.target.value)} 
                        checked={productSubmissionStyle === "ADDPRODUCT"}
                        />
          Add Product
          &nbsp;&nbsp;&nbsp;&nbsp;
          <input type="radio" value="LOADPRODUCT" name = "Product Submission Style" 
                        onClick={e => setProductSubmissionStyle(e.target.value)}
                        />
          Load Product
        </div>
      </div>
      <div>
        Customer ID: 
        <input
          className={styles.textbox}
          aria-label="Customer ID"
          name="customerID"
          value={customerID || ''}
          onChange={e => validate(e)}
        />
        {isError?.customerID?.length > 0 && 
          <span className='error'>
            <br></br>
            {isError.customerID}
          </span>
        }
        <br></br>
        Product Name: 
        <input
          className={styles.textbox}
          aria-label="Product Name"
          name="productName"
          value={productName || ''}
          onChange={e => validate(e)}
        />
        {isError?.productName?.length > 0 && 
          <span className='error'>
            <br></br>
            {isError.productName}
          </span>
        }
        <br></br>
        Domain: 
        <input
          className={styles.textbox}
          aria-label="Domain"
          name="domain"
          value={domain || ''}
          onChange={e => validate(e)}
        />
        {isError?.domain?.length > 0 && 
          <span className='error'>
            <br></br>
            {isError.domain}
          </span>
        }
        <br></br>
        Start Date: 
        <input
          className={styles.textbox}
          aria-label="Start Date"
          name="startDate"
          type="date"
          value={startDate || setMinimumDate(new Date())}
          min={setMinimumDate(new Date())}
          onChange={e => validate(e)}
        />
        <br></br>
        Duration Months: 
        <input
          className={styles.textbox}
          aria-label="Duration Months"
          name="durationMonths"
          type="number"
          min={0}
          //value={domain || 0} //causing inability to change value
          onChange={e => setDurationMonths(e.target.value)}
        />
        {isError?.durationMonths?.length > 0 && 
          <span className='error'>
            <br></br>
            {isError.durationMonths}
          </span>
        }
        <br></br>
        <button
          className={styles.asyncButton}
          disabled={disableSubmit}
          onClick={() => dispatch(addToList(buildProduct("Add")))}
        >
          Submit Product
        </button>
      </div>
      <div className="radio">
          <input type="radio" value="LISTBYPRODUCTS" name = "List Sort Order"
            onClick={e => setProductListSortOrder(e.target.value)} 
            checked={productListSortOrder === "LISTBYPRODUCTS"}
            />
          List by Products
          &nbsp;&nbsp;&nbsp;&nbsp;
          <input type="radio" value="LISTBYEMAILSCHEDULE" name = "List Sort Order" 
            onClick={e => setProductListSortOrder(e.target.value)}
            />
          List by Email Schedule
        </div>
      <div>
        <ul>
          {productList
          .slice()
          .sort(function (a, b) {
            if(productListSortOrder === "LISTBYPRODUCTS"){
              return a.customerID.localeCompare(b.customerID);
            }
            else if(productListSortOrder === "LISTBYEMAILSCHEDULE"){
              return a.emailDate.localeCompare(b.emailDate);
            }
          })
          .map(item => {
            return <li>{
            item.customerID} 
            &nbsp;&nbsp;&nbsp;&nbsp; 
            {item.productName}
            &nbsp;&nbsp;&nbsp;&nbsp;
            {item.domain}
            &nbsp;&nbsp;&nbsp;&nbsp;
            {item.emailDate /*picking up an extra 6 years but correct month and day at last test*/}
            &nbsp;&nbsp;&nbsp;&nbsp;
            {item.durationMonths}
            </li>;
          })}
        </ul>
      </div>
    </div>
  );
}
