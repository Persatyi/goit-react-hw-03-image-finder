import { Component } from 'react';
import Searchbar from 'components/Searchbar/Searchbar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Modal from 'components/Modal/Modal';
import Button from 'components/Button/Button';
import api from 'components/Services/pictureApi';
import Loader from 'components/Loader/Loader';

class App extends Component {
  state = {
    value: '',
    page: 1,
    hits: [],
    isOpen: false,
    imageForModal: { src: '', alt: '' },
    loading: false,
  };

  componentDidUpdate(_, prevState) {
    if (prevState.value !== this.state.value) {
      this.findPicture();
    }

    if (prevState.page < this.state.page) {
      this.findPicture();
    }
  }

  findPicture = async () => {
    const query = this.state.value;
    api.page = this.state.page;
    this.setState({
      loading: true,
    });
    await api.fetchPicturesBySearchQuery(query).then(res => {
      this.setState(prev => ({
        hits: [...prev.hits, ...res],
        loading: false,
      }));
      return res;
    });
  };

  onSubmit = param => {
    this.setState({
      value: param,
      page: 1,
      hits: [],
    });
  };

  openModal = e => {
    this.setState({
      isOpen: true,
      imageForModal: { src: e.target.dataset.src, alt: e.target.alt },
    });
  };

  closeModal = () => {
    this.setState({
      isOpen: false,
    });
  };

  loadMore = () => {
    this.setState(prev => {
      return { page: prev.page + 1 };
    });
  };

  render() {
    return (
      <>
        <Searchbar onSubmit={this.onSubmit} />
        <ImageGallery images={this.state.hits} openModal={this.openModal} />
        {this.state.isOpen ? (
          <Modal
            image={this.state.imageForModal}
            closeModal={this.closeModal}
          />
        ) : null}
        {!!this.state.hits.length && <Button onClick={this.loadMore} />}
        {this.state.loading && <Loader />}
      </>
    );
  }
}

export default App;
