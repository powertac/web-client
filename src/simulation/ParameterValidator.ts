/*
 * PLEASE BE ADVISED: at this time a parameter set is considered valid on the client side if
 * (a) at least one parameter is present
 * (b) all present parameters have a non-empty value
 *
 * PARAMETERS' CORRECTNESS REGARDING INTERNAL SIMULATION LOGIC IS NOT YET CONSIDERED !
 */
export function parametersValid(parameters: {[key: string]: string}): boolean {
    console.log(parameters);
    const keys = Object.keys(parameters).filter(key => key !== undefined);
    const values = keys.map((key) => parameters[key])
        .filter((value) => value !== undefined)
        .filter((value) => value.length > 0);
    return keys.length > 0 && keys.length === values.length;
}
