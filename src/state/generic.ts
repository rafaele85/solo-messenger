import {PayloadAction, CreateSliceOptions, SliceCaseReducers, createSlice, Slice} from "@reduxjs/toolkit";

export interface IGenericState<T> {
    value?: T;
};

export type IGenericAction<T> = PayloadAction<T|undefined>;

export class GenericState<T> {
    private initialState: T;
    private name: string;
    private options: CreateSliceOptions<IGenericState<T>, SliceCaseReducers<IGenericState<T>>, string>;
    private slice: Slice<IGenericState<T>, SliceCaseReducers<IGenericState<T>>, string>;

    public constructor(initialState: T, name: string) {
        this.initialState = initialState;
        this.name = name;
        this.options = {
            name: this.name,
            initialState: {
                value: this.initialState
            },
            reducers: {
                //ToDo fix
                setValue: (state: any, action: IGenericAction<T>) => {
                    state.value = action.payload;
                },
            }
        };
        this.slice = createSlice(this.options);
    }

    public reducer() {
        return this.slice.reducer;
    }

    public setValue() {
        return this.slice.actions.setValue;
    }
}
