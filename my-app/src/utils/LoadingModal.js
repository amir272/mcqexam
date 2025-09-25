import {Spinner} from "react-bootstrap";
import React from "react";
function LoadingModal({message}) {
    return (
        <div id="modal" className="modal" tabIndex="-1" role="dialog" style={{display: 'block'}}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{message}</h5>
                    </div>
                    <div className="modal-body"
                         style={{
                             display: 'flex', alignItems: 'center', justifyContent: 'center',
                             justifyItems: 'center', flexDirection: 'column'
                         }}>
                        <Spinner/>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default LoadingModal