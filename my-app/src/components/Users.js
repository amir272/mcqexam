import React from "react";
import { gql, useQuery} from '@apollo/client';

const getProductByName = gql`
query GetProdByName($name: String!)
    {
    findProdByName(name: $name) {
      id
      productName
      productType
      unitSoldSoFar
      manufacturer
      price
    }
  }`

function Product(){
  const [name, setName] = React.useState("");
  const [show, setShow] = React.useState(false);
  const { loading, error, data } = useQuery(getProductByName, {
    variables: {name}
});
console.log(data)

  const showEmp = ()=>{
     if(loading) return <p>loading</p>
     if(error) return <p>Error</p>
     if(data===null) return <p>No product found</p>
    return data.findProdByName.map((pro)=>{
         return(
            <tr key={pro.id}>
            <td>{pro.productName}</td>
            <td>{pro.productType}</td>
            <td>{pro.manufacturer}</td>
            <td>{pro.unitSoldSoFar}</td>
            <td>{pro.price}</td>
          </tr>
          ) 

    })
  }

  function handleSubmit(e){
    e.preventDefault();
    setShow(true);
  }

  return (
    <div>
        <div className="container">
        <div className="row justify-content-center">
        </div>
        <div className="row justify-content-center">
                        <div className="col-12 col-md-10 col-lg-8">
                            <form className="card card-sm" onSubmit={handleSubmit}>
                                <div className="card-body row no-gutters align-items-center">
                                    <div className="col-auto">
                                        <i className="fas fa-search h4 text-body"></i>
                                    </div>
                                    <div className="col">
                                        <input  onChange={(event)=>setName(event.target.value)} 
                                        className="form-control form-control-lg form-control-borderless" type="search" placeholder="Enter any product name"/>
                                    </div>
                                    <div className="col-auto">
                                        <button className="btn btn-lg btn-success" type="submit">Search</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                   {name!=="" && show &&  <div className="row justify-content-center ">
       <table className="table">
  <thead>
    <tr>
      <th scope="col">Product Name</th>
      <th scope="col">Product type</th>
      <th scope="col">Manufacturer</th>
      <th scope="col">UnitSoldSoFar</th>
      <th scope="col">Price</th>
    </tr>
  </thead>
  <tbody>
    {showEmp()}
  </tbody>
</table>
    </div> }
</div>
    </div>
  )
}

export default Product;