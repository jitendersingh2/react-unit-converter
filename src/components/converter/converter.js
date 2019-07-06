import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import convert from 'convert-units';
import './converter.css';

class Converter extends Component {
    temperatureUnits = {
        'celsius': 'C',
        'fahrenheit': 'F',
        'kelvin': 'K',
        'rankine': 'R'
    }

    volumeUnits = {
        'liters': 'l',
        'tablespoons': 'tsp',
        'cubic-inches': 'in3',
        'cups': 'cup',
        'cubic-feet': 'ft3',
        'gallons': 'gal'
    }

    state = {
        inputValue: {
            value: '',
            isValid: true
        },
        unitOfMeasure: {
            value: '',
            isValid: true
        },
        targetUnitOfMeasure: {
            value: '',
            isValid: true
        },
        studentResponse: {
            value: '',
            isValid: true
        },
        output: ''
    }

    onInputChange = (e) => {
        const { id } = e.target;
        const value = e.target.value.trim();
        this.setState({
            [id]: {
                ...this.state[id],
                value
            }
        });
    }

    isValidInput = value => parseFloat(value) ? true : false

    isValidUnit = value => this.temperatureUnits[value] || this.volumeUnits[value] ? true : false

    iaAllInputsValid = _ => {
        const { inputValue, unitOfMeasure, targetUnitOfMeasure } = this.state;
        inputValue.isValid = this.isValidInput(inputValue.value);
        unitOfMeasure.isValid = this.isValidUnit(unitOfMeasure.value.toLowerCase());
        targetUnitOfMeasure.isValid = this.isValidUnit(targetUnitOfMeasure.value.toLowerCase());
        
        this.setState({ inputValue, unitOfMeasure, targetUnitOfMeasure });
        return inputValue.isValid && unitOfMeasure.isValid && targetUnitOfMeasure.isValid;
    }

    roundToTenthPlaces = (num) => Math.round(10 * parseFloat(num))/10

    calculateOutput = (e) => {
        e.preventDefault();
        if(!this.iaAllInputsValid()) {
            this.setState({
                output: 'invalid'
            });
            return ;
        }
        const { inputValue, unitOfMeasure, targetUnitOfMeasure, studentResponse } = this.state;
        const inputNumericValue = parseFloat(inputValue.value);
        const baseUnit = this.temperatureUnits[unitOfMeasure.value.toLowerCase()] || this.volumeUnits[unitOfMeasure.value.toLowerCase()];
        const targetUnit = this.temperatureUnits[targetUnitOfMeasure.value.toLowerCase()] || this.volumeUnits[targetUnitOfMeasure.value.toLowerCase()];
        let calculatedResponse = '';
        try {
            calculatedResponse = this.roundToTenthPlaces(convert(inputNumericValue).from(baseUnit).to(targetUnit));
        } catch(e) {
            this.setState({
                output: 'invalid',
                invalidInput: false
            });
            return ;
        }
        
        const isResponseCorrect = calculatedResponse === this.roundToTenthPlaces(studentResponse.value);
        this.setState(_ => ({
            output: isResponseCorrect ? 'Correct' : 'Incorrect',
            studentResponse: {
                ...studentResponse,
                isValid: isResponseCorrect
            }
        }));
    }

    render() {
        const { inputValue, unitOfMeasure, targetUnitOfMeasure, studentResponse, output } = this.state;
        return ( 
            <Form className="unit-conversion-form">
                <FormGroup>
                    <Label for="inputValue" className="input-label">Numeric Value</Label>
                    <Input type="text" name="inputValue" id="inputValue" placeholder="Enter Numeric Value" value={inputValue.value} onChange={this.onInputChange} invalid={!inputValue.isValid} className={!inputValue.isValid ? 'isInvalid' : ''} />
                </FormGroup>
                <FormGroup>
                    <Label for="unitOfMeasure" className="input-label">Unit of Measure</Label>
                    <Input type="text" name="unitOfMeasure" id="unitOfMeasure" placeholder="Enter Unit of Measure" value={unitOfMeasure.value} onChange={this.onInputChange} invalid={!unitOfMeasure.isValid} className={!unitOfMeasure.isValid ? 'isInvalid' : ''} />
                </FormGroup>
                <FormGroup>
                    <Label for="targetUnitOfMeasure" className="input-label">Target Unit of Measure</Label>
                    <Input type="text" name="targetUnitOfMeasure" id="targetUnitOfMeasure" placeholder="Enter Target Unit of Measure" value={targetUnitOfMeasure.value} onChange={this.onInputChange} invalid={!targetUnitOfMeasure.isValid} className={!targetUnitOfMeasure.isValid ? 'isInvalid' : ''} />
                </FormGroup>
                <FormGroup>
                    <Label for="studentResponse" className="input-label">Enter Student Response</Label>
                    <Input type="text" name="studentResponse" id="studentResponse" placeholder="Enter Student Response" value={studentResponse.value} onChange={this.onInputChange} invalid={!studentResponse.isValid} className={!studentResponse.isValid ? 'isInvalid' : ''} />
                </FormGroup>
                <div className="text-right btn-wrapper">
                    <Button onClick={this.calculateOutput} color="primary">Calculate Output</Button>
                </div>
                {output !== '' && (
                    <div className="output-wrapper">
                        <span className="input-label">Output</span>&nbsp;&nbsp;&nbsp;<span>{output}</span>
                    </div>
                )}
            </Form>
        );
    }
}
 
export default Converter;