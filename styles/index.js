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
                border-bottom: var(--item-border-bottom-size,2px) solid var(--row-item-bottom-color,#515151);
                border-radius: var(--border-radius,10px);
                padding: 10px 0px;
                align-items: center;
            }
            .add-input-wrapper > .input-fields{
                display: inline-grid;
                grid-template-columns: 1fr 2fr;
                gap:10px;
                margin-left:30px;
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
                color:var(--row-icons-color,#515151);
            }
            paper-button#add-new-item-btn{
                color:var(--add-button-color,'');
                background-color:var(--add-button-background,'');
                width:120px;
                height:35px;
            }
            @media screen and (max-width: 420px) {
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
                border-bottom: var(--header-border-bottom-size,3px) solid var(--header-bottom-border-color,#515151);
                border-radius: var(--border-radius,10px);
                font-size: var(--header-font-size,17px);
                color: var(--header-text-color,'');
                font-weight: bold;
                }
            .grid-template-2-column{
                grid-template-columns:1fr minmax(70px,auto);
            }
            .grid-template-1-column{
                grid-template-columns:1fr 2fr;
            }
            @media screen and (max-width: 420px) {
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
        color:var(--row-icons-color,#515151);
    }
    iron-icon{
        color:var(--row-icons-color,#515151);
        cursor:grabbing;
    }
    .delete-btn:hover{
        color:#fa3636;
    }
    .edit-btn:hover{
        color:#80cbc4;
    }
    .item-block{
        width: 100%;
        display:inline-grid;
        gap:10px;
        align-items:center;
        grid-template-columns: 1fr 2fr auto auto;
        font-size: var(--row-item-font-size,17px);
        padding: 5px 0px;
        padding-left:10px;
        min-height:40px;
        user-select:text;
        }
    .item-row-wrapper{
        display: flex;
        cursor: default;
        align-items: center;
        color:var(--row-item-color);
        background:var(--row-item-background);
        width: 100%;
    }
    .item-bottom-border{
        border-bottom: var(--item-border-bottom-size,2px) solid var(--row-item-bottom-color,#515151);
        border-radius: var(--border-radius,10px);
    }
    .grid-template-3-column{
        grid-template-columns:1fr auto auto;
    }
    @media screen and (max-width: 420px) {
        .item-block{
            display:inline-grid;
            grid-template-columns:1fr auto;
            grid-template-rows: auto auto;
            gap:0px;
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