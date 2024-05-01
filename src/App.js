import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const apiKey = ""; // Limite de 50 chamadas por hora
  const [search, setSearch] = useState(''); // Define o termo de pesquisa
  const [images, setImages] = useState([]); // Define as imagens a serem exibidas
  const [page, setPage] = useState(1); // Define a pagina a ser chamada na API
  const [selectedImage, setSelectedImage] = useState(null); // Define a imagem selecionada

  // pedir imagens com base na pesquisa
  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${search}&page=${page}&per_page=12&client_id=${apiKey}`
      );

      // Atualiza as imagens considerando se e a primeira pagina ou nao
      setImages((prevImages) => (page === 1 ? response.data.results : [...prevImages, ...response.data.results]));
    } catch (error) {
      console.error('Erro ao procurar imagens:.', error);
    }
  };

  // Funcao para pedir imagens aleatorias
  const fetchRandomImages = async () => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos/random?count=12&client_id=${apiKey}`
      );

      // Define as imagens obtidas
      setImages(response.data);
    } catch (error) {
      console.error('Erro ao buscar procurar aleatórias:', error);
    }
  };

  // Funcao para lidar com a pesquisa
  const handleSearch = () => {
    if (search !== '') {
      setPage(1); // Reinicia a pagina ao realizar uma nova pesquisa
      setImages([]); // Limpa as imagens para exibir as novas da pesquisa
      fetchImages(); // Chama a API para pedir as imagens
    }
  };

  // Funcao para carregar mais imagens
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);

    if (search !== '') {
      fetchImages(); // Chama a API para pedir mais imagens
    } else {
      fetchRandomImages(); // Chama a API para pedir mais imagens aleatorias
    }
  };

  // lidar com o clique numa imagem
  const handleImageClick = (image) => {
    setSelectedImage(image); // Define a imagem selecionada para mostrar no modal
  };

  // fechar o modal
  const handleCloseModal = () => {
    setSelectedImage(null); // Limpa a imagem selecionada para fechar o modal
  };

  // lidar com o clique no botao de download
  const handleDownload = () => {
    window.open(selectedImage.urls.full, '_blank'); // Abre a imagem numa nova aba
  };
  
  // Carregar imagens aleatorias ao carregar a pagina
  useEffect(() => {
    fetchRandomImages();
  }, []);

  // App
  return (
    <div className="container">
      <h1>Galeria de Imagens</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Procurar imagens..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Procurar</button>
      </div>
      <div className="galeria-imagens">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.urls.small}
            alt={image.alt_description}
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div>
      {images.length > 0 && (
        <div className="carregar-mais-container">
          <button className="carregar-mais" onClick={handleLoadMore}>
            Carregar +
          </button>
        </div>
      )}

      {selectedImage && (
        <div className="modal-overlay">
        <div className="modal">
          <div className="modal-content">
            <img src={selectedImage.urls.full} alt={selectedImage.alt_description} />
            <p>{selectedImage.description || selectedImage.alt_description || 'Sem descrição disponível'}</p>
            <p>{selectedImage.width} x {selectedImage.height} px</p>
            <div className="button-container">
              <button className="fechar-button" onClick={handleCloseModal}>
                Fechar
              </button>
              <button className="download-button" onClick={handleDownload}>
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default App;
