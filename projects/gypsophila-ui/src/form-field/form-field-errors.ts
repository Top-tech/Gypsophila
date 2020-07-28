export function getGypFormFieldMissingControlError(): Error {
    return Error('gyp-form-field must contain a GypFormFieldControl.');
}
