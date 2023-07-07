import { html } from 'lit';

export const CustomDndStyles = html`
    <style>
            .custom-dnd-list-wrapper{
                padding:5px;
            }
            .add-input-wrapper{
                display: grid;
                width: 100%;
                gap: 10px;
                grid-template-columns: 1fr auto;
                margin-bottom: 10px;
                border-bottom: var(--fw-crud-dnd-item-border-size,2px) solid var(--fw-crud-dnd-item-bottom-color,#515151);
                border-radius: var(--fw-crud-dnd-border-radius,10px);
                padding: 10px 0px;
                align-items: center;
            }
            .add-input-wrapper > .input-fields{
                display: inline-grid;
                grid-template-columns: 1fr 2fr;
                gap:10px;
                margin-left:30px;
            }
            .add-input-wrapper > .input-fields paper-input:invalid{
                margin-bottom:10px;
            }
            .add-input-wrapper > .grid-template-1-column{
                grid-template-columns:1fr ;
            }
            .add-input-wrapper > .add-input-actions-btn{
                display: inline-grid;
                grid-template-columns: 40px 40px;
                gap: 10px;
            }
            paper-icon-button{
                color:var(--fw-crud-dnd-icons-color,#515151);
            }
            #add-new-item-btn{
                color: var(--fw-crud-dnd-add-button-color,'');
                background: var(--fw-crud-dnd-add-button-background,'');
                cursor: pointer;
                gap: 5px;
                height: 29px;
                /* position: absolute; */
                /* top: -2px; */
                /* right: 15px; */
            }
            paper-input.box{
                --paper-input-container_-_padding: 0px 0px;
                --paper-input-container-input_-_padding-left:10px;
            }
            drag-drop-list{
                --fw-drag-active-padding:60px;
            }
            @media all and (max-width: 500px) {
                .add-input-wrapper{
                    display:inline-grid;
                    grid-template-columns:1fr minmax(50px,auto);
                    gap:0px;
                }
                .add-input-wrapper > .input-fields{
                    grid-template: 1fr 1fr / auto;
                }
                .add-input-wrapper > .add-input-actions-btn{
                    grid-template: 1fr 1fr / auto;
                }
                .grid-row-2-item{
                    grid-row:2;
                }
                .box.grid-row-2-item{
                    padding-left:30px;
                }
                drag-drop-list{
                --fw-drag-active-padding:120px;
            }
            }
    </style>
`;

export const HeaderRowStyle = html`
            <style>
            .header-row{
                display: inline-grid;
                grid-template-columns: 1fr 2fr auto;
                gap: 5px;
                width: calc( 100% - 30px );
                padding: 0px 0px 5px 30px;
                border-bottom: var(--fw-crud-dnd-header-border-size,3px) solid var(--fw-crud-dnd-header-border-color,transparent);
                border-radius: var(--fw-crud-dnd-border-radius,10px);
                font-size: var(--fw-crud-dnd-header-font-size,17px);
                color: var(--fw-crud-dnd-header-text-color,'');
                font-weight: bold;
            }
            .header-row span{
                display: inline-flex;
                align-items: center;                    
            }
            .grid-template-2-column{
                grid-template-columns:1fr minmax(70px,auto);
            }
            .grid-template-1-column{
                grid-template-columns:1fr 2fr;
            }
            @media all and (max-width: 500px) {
                .header-row{
                    display:inline-grid;
                    grid-template-columns:1fr auto;
                    grid-template-rows: auto auto;
                    gap:0px;
                }
            }
        </style>
`;

export const ItemRowStyle = html`
<style>
    paper-icon-button{
        color:var(--icons-color,#515151);
    }
    iron-icon{
        color:var(--icons-color,#515151);
        cursor:grabbing;
    }
    .delete-btn:hover{
        color:#fa3636;
    }
    .edit-btn:hover{
        color:#80cbc4;
    }
    .info-btn:hover{
        cursor:pointer;
    }
    .info-btn-text:after {
        content: attr(title);
        font-size: 12px;
        display: block;
        width: max-content;
        position: absolute;
        right: 0;
        bottom: -4px;
    }
    .item-block{
        width: 100%;
        display:inline-grid;
        gap:10px;
        word-break: break-word;
        align-items:center;
        grid-template-columns: 1fr 2fr auto auto;
        font-size: var(--fw-crud-dnd-item-font-size,17px);
        padding: 5px 0px;
        padding-left:10px;
        min-height:40px;
        user-select:text;
        }
    .item-row-wrapper{
        display: flex;
        cursor: default;
        align-items: center;
        color:var(--fw-crud-dnd-item-color);
        background:var(--fw-crud-dnd-item-background);
        width: 100%;
    }
    .item-bottom-border{
        border-bottom: var(--fw-crud-dnd-item-border-size,2px) solid var(--fw-crud-dnd-item-border-color,transparent);
        border-radius: var(--fw-crud-dnd-border-radius,10px);
    }
    .grid-template-3-column{
        grid-template-columns:1fr auto auto;
    }
    .item-block >paper-input.box{
                --paper-input-container_-_padding: 0px 0px;
                --paper-input-container-input_-_padding-left:10px;
        }
    @media all and (max-width: 500px) {
        .item-block{
            display:inline-grid;
            grid-template-columns:1fr auto;
            grid-template-rows: auto auto;
            gap:0px;

        }
        .info-btn-text:after{
            font-size:14px;
        }
        .grid-row-2-item{
            grid-row:2;
        }
        .grid-reposition-btn{
            grid-column:2;
        }
    }
</style>
`;