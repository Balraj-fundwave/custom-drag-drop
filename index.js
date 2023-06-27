import { LitElement, html } from 'lit';
import "./customDragDropList";

export class IndexClass extends LitElement{
    static get properties(){
        return {
            list:Array
        }
    }
    constructor(){
        super();
        this.list = [...sampleDocumentTags];
    }
    //GET REQUEST TO DB TO FETCH THE TAGS
    // this.list = request response

    handleDelete(eventDetails){
        console.log(eventDetails.data)
        //API CALL TO DELETE THE ITEM
        const deletedTag = eventDetails.data;
        this.list= this.list.filter((tag)=> tag.id !== deletedTag.id);
    }
    handleAdd(eventDetails){
        console.log(eventDetails.data)
        //API CALL TO CREATE NEW TAG    //API RESPONSE with id from server
        const addedTag = eventDetails.data;
        addedTag['id']= `randomID${Math.random().toString().slice(2,11)}`
        this.list = [...this.list,addedTag];
    }
    handleUpdate(eventDetails){
        console.log(eventDetails.data)
        //API CALL TO UPDATE THE DETAILS OF THE TAG;
        const updatedTag = eventDetails.data;
        this.list = this.list.filter((tag)=> tag.id !== updatedTag.id);
        this.list = [...this.list,updatedTag]
    }
    render(){
        return html`
        <style>
            .property-list{
                display:flex; flex-grow:1; gap:10px;
                flex-direction:column;
                
            }
            .property-list  div{
                grid-template-columns:1fr 1fr 1fr
            }
            @media screen and (max-width:700px){
                .property-list div{
                    flex-direction:column;
                    grid-template-columns:1fr 1fr
                }
            }
            hr{
                border-width:5px
            }
        </style>
            <div style='margin:auto; width:85%'>
            <h2 style='margin-left:10px;'> Editable/ Reorderable/ Custom Tag CRUD List </h2>
            <div  class='property-list'>
                <div>
                    <h2> Properties and events handlers</h2>
                    <div style='display:flex; gap:10px;'>
                    <div style='max-width:500px'>
                    <h3>Properties for the custom element</h3>
                    <p><span style='font-weight:bold'>list * :</span><span> The list of objects to be displayed.</span>  </p>
                    <p style='font-weight:bold' >editable</p>
                    <p style='font-weight:bold' >_stepSize</p>
                    <p style='font-weight:bold' >primaryAttribute *</p>
                    <p style='font-weight:bold' >secondaryAttribute</p>
                    <p style='font-weight:bold' >uniqueIdAttribute *</p>
                    <p><span style='font-weight:bold'>positionAttribute:</span><span> Numeric attribute that determine the order of items in the list</span></p>
                    <p><span style='font-weight:bold'>defaultPrimaryAttribute:</span><span> If present in the object , the item cannot be deleted for the object. Also act as default for the primary attribute.</span></p>
                    <p><span style='font-weight:bold'>primaryHeaderValue:</span><span> required to display the header </span></p>
                    <p style='font-weight:bold'>secondaryHeaderValue</p>
                    </div>
                    <div>
                    <h3>Event Handlers</h3>
                    <p><p style='font-weight:bold'>@item-added: </p><span>contain {name,description,position} of the added object</span></p>
                    <p><p style='font-weight:bold'>@item-deleted: </p><span>contain details of the deleted object</span></p>
                    <p><p style='font-weight:bold'>@item-updated: </p><span>contain the updated details of an</span></p>
                    </div>
                    <div>
                    <h3>List of Object</h3>
                    <p>[ {</p>
                    <p>id:"7s2kjshfn39c8cea31387c33",</p>
                    <p>name:"Notices",</p>
                    <p>description:"Notices Description",</p>
                    <p>position:3072,</p>
                    <p>defaultTagName:"Notices"</p>
                    <p> }  ]</p>
                    </div>
                </div>
                </div>
                <div>
                <h2>CSS VARIABLES</h2>
                <div style='display: inline-grid;
                            gap: 0px 15px;'>
                    <p>--header-bottom-border-color</p>  
                    <p>--header-font-size</p>
                    <p>--header-border-bottom-size</p>
                    <p>--header-text-color</p>
                    <p>--row-item-font-size</p>
                    <p>--row-item-bottom-color</p>
                    <p>--border-radius</p>
                    <p>--row-item-color</p>
                    <p>--row-item-background</p>
                    <p>--row-icons-color</p>
                    <p>--item-border-bottom-size</p>
                    <p>--add-button-color</p>
                    <p>--add-button-background</p>
                    <p>--drag-over-line-color</p>
                </div>
                </div>
            </div>
            <hr/>
                <h3>The Custom-dnd-list Element</h3>
                <custom-dnd-list
                .list=${this.list}
                .editable = ${true}
                ._stepSize=${1024}
                primaryAttribute= 'name'
                secondaryAttribute= 'description'
                uniqueIdAttribute =  'id'
                positionAttribute =  'position'
                defaultPrimaryAttribute= 'defaultTagName'
                primaryHeaderValue = 'Tag  Name'
                secondaryHeaderValue = 'Tag  Description'
                @item-deleted=${(e)=>this.handleDelete(e.detail)}
                @item-added=${(e)=>this.handleAdd(e.detail)}
                @item-updated=${(e)=>this.handleUpdate(e.detail)}
                ></custom-dnd-list>
                <hr/>
                <h3>The Custom-dnd-list Element with Editable:False </h3>
                <custom-dnd-list
                .list=${this.list}
                .editable = ${false}
                ._stepSize=${1024}
                primaryAttribute= 'name'
                secondaryAttribute= 'description'
                uniqueIdAttribute =  'id'
                positionAttribute =  'position'
                defaultPrimaryAttribute= 'defaultTagName'
                primaryHeaderValue = 'Tag  Name'
                secondaryHeaderValue = 'Tag  Description'
                @item-deleted=${(e)=>this.handleDelete(e.detail)}
                @item-added=${(e)=>this.handleAdd(e.detail)}
                @item-updated=${(e)=>this.handleUpdate(e.detail)}
                ></custom-dnd-list>
                <hr/>
                <h3>The Custom-dnd-list Element with Single Attribute </h3>
                <custom-dnd-list
                .list=${this.list}
                .editable = ${true}
                
                primaryAttribute= 'name'
                
                uniqueIdAttribute =  'id'
                positionAttribute =  'position'
                defaultPrimaryAttribute= 'defaultTagName'
                primaryHeaderValue = 'Tag  Name'
                
                @item-deleted=${(e)=>this.handleDelete(e.detail)}
                @item-added=${(e)=>this.handleAdd(e.detail)}
                @item-updated=${(e)=>this.handleUpdate(e.detail)}
                ></custom-dnd-list>
                <hr/>
                
                </div>
            </div>  
        `;
    }
}
const sampleDocumentTags = [
    {
      id: "62b56101904ca55d591af825",
      name: "Term Sheet",
      position: 2048
    },
      {
        id: "32rfew2f432a55d591af825",
        name: "Subscription Agreement",
        position: 5120
      },
      {
      id: "60c2075225ecbda94db4a78d",
      name: "IRA",
      description: "Investor Right Agreement",
      position: 4096
    },
    {
        id: "23rf3wf34225ecbda94db4a78d",
        name: "RoFR",
        description: "Right of First Refusal",
        position: 6144
    },
    {
        id: "5ee9b297cc6c8cea31387c33",
        name: "VA",
        description: "Voting agreement",
        position: 1024
    },
    {
        id:"7s2kjshfn39c8cea31387c33",
        name:"Notices",
        position:3072,
        defaultTagName:"Notices"
    },
    {
      id:"jdn372vbks87cea31387c33",
      name:"Reports",
      position:7168,
      defaultTagName:"Reports"
  } 
  ]
const singleItemList = [{
      id: "5ee9b297cc6c8cea31387c33",
      name: "VA",
      description: "Voting agreement",
      position: 1024
    }];

window.customElements.define('index-tag',IndexClass);