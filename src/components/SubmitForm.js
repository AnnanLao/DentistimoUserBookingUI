import React, { Component } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/SubmitForm.css';

var timeSlotArr = []
var dentistArr = []

class SubmitForm extends Component {
    state = {
        selectedDentistryOption: 'None',
    }
    constructor(props){
        super(props)

        this.state = {
            timeSlot: '',
            dentistry: '',
        }
    }
    handleDentistryChange = (event) => {
        this.setState({dentistry: event.target.value});
        timeSlotArr = []
        var thisDentist = []
        var selectedDay = 'monday'
        var openingHours = ''
        var start = ''
        var end = ''

        //Checks of there is a dentistry within the array that matches the name of the selected dentistry, if true it copies the dentistry
        //over to thisDentist array
        for (var i = 0; i < dentistArr.length; i++){
            if (dentistArr[i].name === event.target.value){
                thisDentist = dentistArr[i]
            }
        }
        //Checks if which day of the week has been selected
        for (i = 0; i < Object.keys(thisDentist.openinghours).length; i++){
            if (Object.keys(thisDentist.openinghours)[i] === selectedDay){
                openingHours = Object.values(thisDentist.openinghours)[i]
            }
        }
        //checks if start begins with a single digit or two
        if (openingHours.charAt(1) === ':'){
        start = openingHours.substring(0, 4)
        end = openingHours.substring(5, 10)
        } 
        else {
            start = openingHours.substring(0, 6)
            end = openingHours.substring(6, 11)
        }
        start = start.replace(':', '.')
        end = end.replace(':', '.')

        //Parses start and end to floats so we can do math on them
        start = parseFloat(start)
        end = parseFloat(end)

        //Calculate the total amount of hours that the dentistry will be open for the selected day
        var totalHours = (end - start)*2
        var halfHour = false

        //Divides the openhours into timeslots
        for (i = 0; i < totalHours; i++){
        if (halfHour){
            timeSlotArr[i] = {time_slot: + '' + start + '' + ':30'}
            
            start++
        }else {
        timeSlotArr[i] = {time_slot: + '' + start + '' + ':00'}
        }
        halfHour = !halfHour
    }
}
    handleTimeChange = (event) => {
        this.setState({timeSlot: event.target.value});
        console.log(event.target.value)
    }
    handleFormChange = ({ target }) => {
        this.setState({
            dentistry: target.value,
        })
    }
    handleSubmit = (event) => {
        var issuance = new Date()
        issuance = issuance.getTime()
        alert(`${this.state.timeSlot} ${this.state.dentistry} ${issuance}`)
        event.preventDefault()
    }
        
    render() {
 //The data from frontpage is sent after the webpage has loaded, so we check if it has been sent, if it has not we have an empty array
 // drop down options for timetable, not working {dentistArr.map(({monday, id}, index) => <option key={id} id ={id} >{monday}</option>)}
        if (this.props.dentistryarr.length) {
            if (dentistArr.length < this.props.dentistryarr.length){
                for (var i = 0; i < this.props.dentistryarr.length; i++){
                    dentistArr.push(this.props.dentistryarr[i])
                }
            }
        }
        return(
            <div id='position'>
              <TextBlock/>
              <label>Select a date:</label><br/>
              <div><Calendar/></div>
                <form onSubmit={this.handleSubmit}>
                    <label>Select a time</label><br/>
                    <select value= {this.state.timeSlot} onChange={this.handleTimeChange}>
                        <option default disabled>Select a time slot</option>
                        {timeSlotArr.map(({time_slot}, index) => <option key={time_slot} time_slot ={time_slot} >{time_slot}</option>)}
                    </select><br/>
                    <label>Select a dentistry</label><br/>
                    <select value= {this.state.dentistry} onChange={this.handleDentistryChange}>
                        <option default disabled={this.state.dentistry}>Select your dentistry</option>
                        {dentistArr.map(({name, id}, index) => <option key={id} id ={id}>{name}</option>)}             
                    </select>
                    <br/>
                    <input type="submit" value="Submit" disabled={!this.state.timeSlot && !this.state.dentistry} />
                </form>
            </div>
        )
    }
}
const TextBlock = () => {
  const textBlock = 'To book a time, either pick the dentistry you want from the form or select a marker on the map and then select a time slot and submit'
  return (
      <p id='textBlock'>{textBlock}</p>
  )
}

export default SubmitForm;
