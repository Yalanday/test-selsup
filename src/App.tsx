import React, { useState, useEffect } from 'react';

interface Param<T> {
    id: number;
    name: string;
    type: T;
}

interface StringParam extends Param<string> {
    type: 'text';
}

interface NumberParam extends Param<number> {
    type: number;
}

interface ArrayParam extends Param<string[] | number[]> {
    type: string[] | number[];
}

interface ParamValue {
    paramId: number;
    value: string;
}

interface Color {
    id: number;
    name: string;
}

interface Model {
    paramValues: ParamValue[];
    colors: Color[];
}

interface Product {
    id: number;
    name: string;
    img: string;
    model: Model;
}

interface Props {
    params: (StringParam | NumberParam | ArrayParam)[];
    initialModel: Model;
    onSave: (model: Model) => void;
}

const ParamEditor: React.FC<Props> = ({ params, initialModel, onSave }) => {
    const [editorModel, setEditorModel] = useState<Model>({ ...initialModel });

    useEffect(() => {
        setEditorModel({ ...initialModel });
    }, [initialModel]);

    const handleParamChange = (paramId: number, value: string) => {
        const updatedParamValues = editorModel.paramValues.map((pv) =>
            pv.paramId === paramId ? { ...pv, value } : pv
        );
        setEditorModel({ ...editorModel, paramValues: updatedParamValues });
    };

    const handleColorChange = (colorId: number, newName: string) => {
        const updatedColors = editorModel.colors.map((color) =>
            color.id === colorId ? { ...color, name: newName } : color
        );
        setEditorModel({ ...editorModel, colors: updatedColors });
    };

    const removeColor = (colorId: number) => {
        const updatedColors = editorModel.colors.filter((color) => color.id !== colorId);
        setEditorModel({ ...editorModel, colors: updatedColors });
    };

    const addColor = () => {
        const newColorId = editorModel.colors.length > 0 ? Math.max(...editorModel.colors.map((c) => c.id)) + 1 : 1;
        const updatedColors = [...editorModel.colors, { id: newColorId, name: '' }];
        setEditorModel({ ...editorModel, colors: updatedColors });
    };

    const getModel = () => {
        console.log(editorModel);
        onSave(editorModel);
    };

    return (
        <div style={{ width: '300px', margin: '0 auto' }}>
            <h3 style={{ textAlign: 'center' }}>Редактор параметров</h3>
            {params.map((param) => {
                const currentParamValue = editorModel.paramValues.find((pv) => pv.paramId === param.id)?.value || '';
                return (
                    <div
                        key={param.id}
                        style={{
                            marginBottom: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}
                    >
                        <label>{param.name}: </label>
                        <input
                            style={{
                                height: '30px',
                                padding: '5px',
                                border: '1px solid silver',
                                borderRadius: '5px',
                                outline: 'none',
                            }}
                            type="text"
                            value={currentParamValue}
                            onChange={(e) => handleParamChange(param.id, e.target.value)}
                        />
                    </div>
                );
            })}

            <h4>Цвета:</h4>
            {editorModel.colors.map((color) => (
                <div key={color.id} style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        value={color.name}
                        onChange={(e) => handleColorChange(color.id, e.target.value)}
                        placeholder="Название цвета"
                    />
                    <button onClick={() => removeColor(color.id)}>Удалить</button>
                </div>
            ))}
            <button onClick={addColor}>Добавить цвет</button>
            <button
                onClick={getModel}
                style={{
                    display: 'block',
                    backgroundColor: 'blue',
                    color: '#ffffff',
                    padding: '10px 20px',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    marginTop: '10px',
                }}
            >
                Сохранить модель
            </button>
        </div>
    );
};

const App: React.FC = () => {
    const params: (StringParam | NumberParam | ArrayParam)[] = [
        { id: 1, name: 'Назначение', type: 'text' },
        { id: 2, name: 'Длина', type: 'text' },
        { id: 3, name: 'Материал', type: 'text' },
    ];

    const [products, setProducts] = useState<Product[]>([
        {
            id: 1,
            name: 'Платье',
            img: 'https://avatars.mds.yandex.net/i?id=d5a3cc9cdcc3e9725ad072e03c068dca_l-5602641-images-thumbs&n=13',
            model: {
                paramValues: [
                    { paramId: 1, value: 'повседневное' },
                    { paramId: 2, value: 'макси' },
                ],
                colors: [
                    { id: 1, name: 'Красный' },
                    { id: 2, name: 'Синий' },
                ],
            },
        },
        {
            id: 2,
            name: 'Рубашка',
            img: 'https://avatars.mds.yandex.net/i?id=a0a2e3b9516008d0c85186a249a46b088c2cc28e-10178110-images-thumbs&n=13',
            model: {
                paramValues: [
                    { paramId: 1, value: 'офисное' },
                    { paramId: 2, value: 'короткая' },
                    { paramId: 3, value: 'синтетика' },
                ],
                colors: [
                    { id: 1, name: 'Белый' },
                    { id: 2, name: 'Черный' },
                ],
            },
        },
    ]);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleModelSave = (updatedModel: Model) => {
        if (!selectedProduct) return;

        const updatedProducts = products.map((product) =>
            product.id === selectedProduct.id ? { ...product, model: updatedModel } : product
        );
        setProducts(updatedProducts);
        setSelectedProduct({ ...selectedProduct, model: updatedModel });
    };

    return (
        <div style={{ padding: '20px 40px' }}>
            <h2 style={{ textAlign: 'center' }}>Список товаров</h2>
            <ul
                style={{
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    padding: 0,
                    justifyContent: 'center',
                }}
            >
                {products.map((product) => (
                    <li
                        key={product.id}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            border: '1px solid #ccc',
                            padding: '20px',
                            textAlign: 'center',
                            width: '300px',
                            boxSizing: 'border-box',
                        }}
                    >
                        <img
                            width={260}
                            height={260}
                            src={product.img}
                            alt={product.name}
                            style={{ objectFit: 'cover', marginBottom: '5px' }}
                        />
                        <h3 style={{ margin: '0 0 10px' }}>{product.name}</h3>
                        <ul
                            style={{
                                listStyleType: 'none',
                                padding: 0,
                                textAlign: 'left',
                            }}
                        >
                            {product.model.paramValues.map((paramValue) => (
                                <li key={paramValue.paramId}>
                                    <b>{params.find((p) => p.id === paramValue.paramId)?.name}:{' '}</b>
                                    {paramValue.value}
                                </li>
                            ))}
                        </ul>
                        <div style={{ display: 'flex', marginBottom: '20px' }}>
                            <b>Цвета:&nbsp;&nbsp;</b>
                            <ul
                                style={{
                                    listStyleType: 'none',
                                    padding: 0,
                                    display: 'flex',
                                }}
                            >
                                {product.model.colors.map((color) => (
                                    <li key={color.id}>{color.name}&nbsp;</li>
                                ))}
                            </ul>
                        </div>
                        <button
                            style={{
                                marginTop: 'auto',
                                backgroundColor: 'blue',
                                color: '#ffffff',
                                padding: '10px 20px',
                                border: 'none',
                                cursor: 'pointer',
                                borderRadius: '5px',
                            }}
                            onClick={() => handleProductSelect(product)}
                        >
                            Редактировать
                        </button>
                    </li>
                ))}
            </ul>
            <div style={{ marginTop: '20px', width: '350px', margin: '0 auto' }}>
                <h2>Редактирование: {selectedProduct?.name || 'Выберите товар'}</h2>
                {selectedProduct && (
                    <ParamEditor
                        params={params}
                        initialModel={selectedProduct.model}
                        onSave={handleModelSave}
                    />
                )}
            </div>
        </div>
    );
};

export default App;