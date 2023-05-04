import * as styles from "../../../../styles/App.module.css";
import InputText from "../InputText/InputText";
import Button from "../Button/Button";

const Form = ({
  onSubmit,
  legendTitle,
  submitTitle,
  fields,
  disabled = false,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <legend>{legendTitle}</legend>
        {fields.map((field, index) => {
          return (
            <div className={styles.formRow} key={index}>
              <InputText
                name={field.name}
                onChange={field.onChange}
                placeholder={field.placeholder}
                value={field.value}
              />
            </div>
          );
        })}
        <Button type="submit" disabled={disabled}>
          {submitTitle}
        </Button>
      </fieldset>
    </form>
  );
};

export default Form;
