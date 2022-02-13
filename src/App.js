import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

// const url = "http://localhost:3050/";
const url = "http://54.152.114.167:80/";

class App extends Component {
  state = {
    data: [],
    promedio: "",
    btn: true,
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id: "",
      nombre: "",
      apellido: "",
      fecha: "",
      tipoModal: "",
    },
  };

  peticionGet = () => {
    axios
      .get(url + "clientes")
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.log(error.message);
      });

    axios
      .get(url + "promedio")
      .then((response) => {
        this.setState({ promedio: response.data[0].p });
        console.log("promedio", response.data[0].p);
      })
      .catch((error) => {
        console.log(error.message);
      });
    console.log("en get", this.state.data);
  };

  peticionPost = async () => {
    console.log("estamos en insertar", this.state.form);
    await axios
      .post(url + "agregar", this.state.form)
      .then((response) => {
        console.log("response", response);
        this.modalInsertar();
        this.peticionGet();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  peticionPut = () => {
    console.log("estamos en insertar", this.state.form);
    axios
      .put(url + "editar/" + this.state.form.id, this.state.form)
      .then((response) => {
        console.log("response", response);
        this.modalInsertar();
        this.peticionGet();
      });
  };

  peticionDelete = () => {
    axios.delete(url + "eliminar/" + this.state.form.id).then((response) => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    });
  };

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarCliente = (cliente) => {
    console.log("cliente.cli_fec_nac", cliente.cli_fec_nac.substring(0, 10));
    this.setState({
      tipoModal: "actualizar",
      form: {
        id: cliente.cli_id,
        nombre: cliente.cli_nom,
        apellido: cliente.cli_ape,
        fecha: cliente.cli_fec_nac.substring(0, 10),
      },
    });
  };

  handleChange = async (e) => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
    if (
      this.state.form.nombre == null ||
      this.state.form.apellido == null ||
      this.state.form.fecha == null ||
      this.state.form.nombre == "" ||
      this.state.form.apellido == "" ||
      this.state.form.fecha == ""
    ) {
      this.setState({ btn: true });
    } else {
      this.setState({ btn: false });
    }
  };

  componentDidMount() {
    this.peticionGet();
  }

  render() {
    const { form } = this.state;
    return (
      <div className="App">
        <br />
        <h1>MDPConsulting Clientes CRUD</h1>
        <br />
        <br />
        <div class="row">
          <div class="col-sm-12">
            edad promedio: <b class="promedio">{this.state.promedio}</b>
          </div>
        </div>
        <br />
        <br />
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Fecha de Nacimiento</th>
              <th>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    this.setState({ form: null, tipoModal: "insertar" });
                    this.modalInsertar();
                  }}
                >
                  <b>Agregar Cliente</b>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((cliente, index) => {
              const fec = cliente.cli_fec_nac.split("T");
              const fecha = fec[0].split("-");
              return (
                <tr key="{index}">
                  <td>{cliente.cli_id}</td>
                  <td>{cliente.cli_nom}</td>
                  <td>{cliente.cli_ape}</td>
                  <td>{fecha[2] + "/" + fecha[1] + "/" + fecha[0]}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        this.seleccionarCliente(cliente);
                        this.modalInsertar();
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    {"   "}
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        this.seleccionarCliente(cliente);
                        this.setState({ modalEliminar: true });
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: "block" }}>
            <span
              style={{ float: "right" }}
              onClick={() => this.modalInsertar()}
            >
              x
            </span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="id">ID</label>
              <input
                className="form-control"
                type="text"
                name="id"
                cli_id="id"
                readOnly
                onChange={this.handleChange}
                value={form ? form.id : ""}
              />
              <br />
              <label htmlFor="cli_nom">Nombre</label>
              <input
                required
                className="form-control"
                type="text"
                name="nombre"
                cli_id="nombre"
                onChange={this.handleChange}
                value={form ? form.nombre : ""}
              />
              <br />
              <label htmlFor="cli_ape">Apellido</label>
              <input
                required
                className="form-control"
                type="text"
                name="apellido"
                cli_id="apellido"
                onChange={this.handleChange}
                value={form ? form.apellido : ""}
              />
              <br />
              <label htmlFor="cli_fec_nac">Fecha de Nacimiento</label>
              <input
                required
                className="form-control"
                type="date"
                name="fecha"
                cli_id="fecha"
                onChange={this.handleChange}
                value={form ? form.fecha : ""}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal == "insertar" ? (
              <button
                id="btnInsertar"
                className="btn btn-success"
                onClick={() => this.peticionPost()}
                disabled={this.state.btn}
              >
                Insertar
              </button>
            ) : (
              <button
                id="btnInsertar"
                className="btn btn-primary"
                onClick={() => this.peticionPut()}
                disabled={this.state.btn}
              >
                Actualizar
              </button>
            )}

            <button
              className="btn btn-danger"
              onClick={() => this.modalInsertar()}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            ¿Deseas eliminar al cliente {form && form.nombre}?
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-danger"
              onClick={() => this.peticionDelete()}
            >
              Sí
            </button>
            <button
              className="btn btn-secundary"
              onClick={() => this.setState({ modalEliminar: false })}
            >
              No
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default App;
