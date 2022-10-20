import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { createEvents, getHotels } from "../../redux/action/action";
import { toast } from "react-toastify";

const validate = (input_event) => {
  let errors = {};

  if (!input_event.name) errors.name = 'Name is required'

  if (!input_event.image) errors.image = 'Upload at least one image'

  if (!input_event.description) errors.description = 'Description is required.. '

  if (!input_event.date) errors.date = 'Date is required. Example: dd/mm/yyyy'

  if (!input_event.price) errors.price = 'Price is required'
  if (/^\d+$^\d+$/.test(input_event.price)) errors.price = 'Price can only contain numeric values'
  if (input_event.price < 0) errors.price = 'Price cannot be a negative value'

  if (!input_event.idHotel) errors.idHotel = 'Hotel name is required'

  return errors;
}

const CreateEvents = () => {
  const dispatch = useDispatch();

  const hotels = useSelector(state=>state.reducerHotel.hotels)
  //const events = useSelector(state => state.reducerHotel.onlyEventsHotel)

  const [input_event, setInput_event] = useState({
    name: '',
    image: '',
    description: '',
    date: '',
    price: 0,
    idHotel:'',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    !hotels.length && dispatch(getHotels());
    //dispatch(getEventsHotel(input_event.idHotel)) 
  }, [dispatch, hotels]) 

  //------------ HANDLE CHANGE CREATE/MODIFY --------------//
  // const handleChangeCreate = (e) => {
  //    e.preventDefault();        
  //    setInput_create({
  //        ...input_create,
  //        [e.target.name] : e.target.value
  //    })        
  // }

  //------------ HANDLE CHANGE NAME EVENTO--------------//
  const handleName = (e) => {
    e.preventDefault();
    setInput_event({
      ...input_event,
      [e.target.name]: e.target.value.toLowerCase().trim()
    })
    setErrors(validate({
      ...input_event,
      [e.target.name]: e.target.value
    }))
  }

  //------------ HANDLE CHANGE --------------//
  const handleChange = (e) => {
    e.preventDefault();
    setInput_event({
      ...input_event,
      [e.target.name]: e.target.value
    })
    setErrors(validate({
      ...input_event,
      [e.target.name]: e.target.value
    }))
  }

  //------------ HANDLE CHANGE HOTEL NAME----------//
  const handleChangeHotel = (e) => {
    e.preventDefault();
    setInput_event({
      ...input_event,
      idHotel: e.target.value
    })
    setErrors(validate({
      ...input_event,
      idHotel: e.target.value
    }))
  }
  //----------------HANDLE SUBMIT EVENT------------------//
  const handleSubmit = (e) => {
    e.preventDefault()
    if (input_event) {
      // if(input_create.option === 'create') {
      dispatch(createEvents(input_event)) //crear la action
      toast.success('Event created successfully', { position: 'bottom-right' })
      // } else {
      //  dispatch(modifyEvents(input_event)) //crear la action
      // toast.success('Event modified successfully', { position: 'bottom-right' })
      // }
      setInput_event({
        name: '',
        image: '',
        description: '',
        date: '',
        price: 0,
        idHotel:'',
      })
    } else {
      toast.error("Check the fields", { position: 'bottom-right' })
    }
  }
   
      

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <label>Hotel Name</label>
      <select value={input_event.idHotel} onChange={(e) => handleChangeHotel(e)}>
        <option hidden selected>Select hotel</option>
        {hotels?.map(e =>
          <option key={e.name} value={e.id}>{e.name}</option>)} {/*mapeo el nombre de los hoteles*/}
      </select>
      {errors.idHotel && (<p>{errors.idHotel}</p>)}

      <label>Event Name</label>
      <input 
        placeholder="Event Name..."
        type="text" 
        value={input_event.name} 
        name="name" 
        onChange={(e) => handleName(e)} 
      />
      {errors.name && (<p>{errors.name}</p>)}

      <div>
        <label>Date</label>
        <input
          type="datetime"
          value={input_event.date}
          name="date"
          onChange={(e) => handleChange(e)}
        />
        {errors.date && (<p>{errors.date}</p>)}
      </div>
      <div>
        <label>Price USD</label>
        <input
          placeholder="Price..."
          type="number"
          value={input_event.price}
          name="price"
          min='0'
          onChange={(e) => handleChange(e)}
        />
        {errors.price && (<p>{errors.price}</p>)}
      </div>
      <div>
        <label>Image</label>
        <input
          placeholder="Load URL Image..."
          type="url"
          value={input_event.image}
          name="image"
          onChange={(e) => handleChange(e)}
        />
        {errors.image && (<p>{errors.image}</p>)}
      </div>
      <div>
        <label>Description</label>
        <textarea
          placeholder="Description..."
          type="text"
          value={input_event.description}
          name="description"
          maxLength="1000"
          onChange={(e) => handleChange(e)}
        />
        {errors.description && (<p>{errors.description}</p>)}
      </div>

      {!input_event.name || !input_event.image || !input_event.description || !input_event.date || !input_event.price ||!input_event.idHotel || Object.keys(errors).length 
        ? (<button disabled type="submit">Send</button>) 
        : (<button type="submit">Send</button>)}
    </form>
  )
}

export default CreateEvents;