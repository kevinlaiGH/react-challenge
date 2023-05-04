import React from "react";

import Address from "./ui/components/Address/Address";
import AddressBook from "./ui/components/AddressBook/AddressBook";
import Button from "./ui/components/Button/Button";
import InputText from "./ui/components/InputText/InputText";
import Radio from "./ui/components/Radio/Radio";
import Section from "./ui/components/Section/Section";
import Form from "./ui/components/Form/Form";
import transformAddress from "./core/models/address";
import useAddressBook from "./ui/hooks/useAddressBook";
import useFormField from "./ui/hooks/useFormField";
import ErrorMessage from "./ui/components/ErrorMessage/ErrorMessage";
import Spinner from "./ui/components/Loading/Loading";
import Image from "next/image";
import * as styles from "../styles/App.module.css";

function App() {
  /**
   * Form fields states
   * TODO: Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { postCode: '', houseNumber: '', ...etc }
   * - ✅ Remove all individual React.useState
   * - Remove all individual onChange handlers, like handlePostCodeChange for example
   */
  const [postCode, handlePostCodeChange, resetPostCode] = useFormField("");
  const [houseNumber, handleHouseNumberChange, resetHouseNumber] =
    useFormField("");
  const [firstName, handleFirstNameChange, resetFirstName] = useFormField("");
  const [lastName, handleLastNameChange, resetLastName] = useFormField("");
  const [selectedAddress, handleSelectedAddressChange, resetSelectedAddress] =
    useFormField(null);
  /**
   * Results states
   */
  const [error, setError] = React.useState(undefined);
  const [addresses, setAddresses] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  /**
   * Text fields onChange handlers
   */

  const fetchAddress = async (postCode, houseNumber) => {
    setLoading(true);
    const res = await fetch(
      `/api/getAddresses?postcode=${postCode}&streetnumber=${houseNumber}`
    );
    const address = await res.json();

    if (address.status === "error") {
      setError(address.errormessage);
      setLoading(false);
      return;
    }
    setError(undefined);
    setLoading(false);
    return address.details;
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const result = await fetchAddress(postCode, houseNumber);

    if (result) {
      const transformResults = result.map((res) => transformAddress(res));

      console.log("transformResults", transformResults);

      setAddresses(transformResults);
    }

    /** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
     * - Example URL of API: /api/getAddresses?postcode=1345&streetnumber=350
     * - Handle errors if they occur
     * - Handle successful response by updating the `addresses` in the state using `setAddresses`
     * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
     * - Bonus: Add a loading state in the UI while fetching addresses
     */
  };

  const handleClearFields = () => {
    resetPostCode();
    resetHouseNumber();
    resetFirstName();
    resetLastName();
    resetSelectedAddress();
    setAddresses([]);
  };

  const handlePersonSubmit = (e) => {
    e.preventDefault();

    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === selectedAddress
    );
    addAddress({ ...foundAddress, firstName, lastName });
  };

  const addressFields = [
    {
      name: "postCode",
      onChange: handlePostCodeChange,
      placeholder: "Post Code",
      value: postCode,
    },
    {
      name: "houseNumber",
      onChange: handleHouseNumberChange,
      placeholder: "House number",
      value: houseNumber,
    },
  ];
  const personFields = [
    {
      name: "firstName",
      onChange: handleFirstNameChange,
      placeholder: "First name",
      value: firstName,
    },
    {
      name: "lastName",
      onChange: handleLastNameChange,
      placeholder: "Last name",
      value: lastName,
    },
  ];

  const results = addresses.length > 0;

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        <Form
          onSubmit={handleAddressSubmit}
          legendTitle="🏠 Find an address"
          submitTitle="Find"
          fields={addressFields}
          disabled={results}
        />
        {loading && (
          <Image
            className={styles.posCenter}
            src={require("./assets/rocket.gif")}
            width="200"
            height="200"
          />
        )}
        {results &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={handleSelectedAddressChange}
                checked={address.id === selectedAddress}
              >
                <Address address={address} />
              </Radio>
            );
          })}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {selectedAddress && (
          <Form
            onSubmit={handlePersonSubmit}
            legendTitle="✏️ Add personal info to address" // TODO: fix emoji
            submitTitle="Add to addressbook"
            fields={personFields}
          />
        )}
        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <ErrorMessage error={error} />}

        {/* TODO: Add a button to clear all form fields. Button must look different from the default primary button, see design. */}
        <Button type="button" variant="secondary" onClick={handleClearFields}>
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
