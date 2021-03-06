import React, { useEffect, useState } from "react";
import { IonButton, IonModal, IonPage, IonRow } from "@ionic/react";

import SearchPage from "../Search";

import { SearchBar } from "../../components/ui";
import RoundButtonHome from "../../components/ui/RoundButtonHome";
import { api } from "../../services/api";
import { getUserData, logout } from "../../services/auth";
import hexToRgbA from "../../utils/hextorgba";

import * as S from "./styles";
import BoxSpotline from "../../components/ui/BoxSpotline";
import { Keyable } from "../../types/Keyable";
import ListCategory from "../ListCategory";

const Home: React.FC = () => {
  const [categories, setCategories] = useState([]);
  const [best, setBest] = useState([]);
  const [showModal, setShowModal] = useState(false);
 
  const [showModalCategory, setShowModalCategory] = useState(false);
  const [idCategory, setIdCategory] = useState(0);
 
  const [userData, setUserData] = useState<Keyable>(JSON.parse(getUserData()));
 

  const getCategory = async () => {
    let response: Keyable = await api.get("/subject/list");

    let temp = response?.data?.map((elem: Keyable) => {
      return {
        ...elem,
        shadow: hexToRgbA(elem.color),
      };
    });
    return temp;
  };

  const getBest = async () => {
    let response: Keyable = await api.get("/audio/list-best");
    console.warn(response);
    return response.data;
  };

  useEffect(() => {
    let mounted = true;
    getCategory().then((resp) => {
      if (mounted) {
        setCategories(resp);
      }
    });

    return function cleanup() {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    getBest().then((resp) => {
      if (mounted) {
        setBest(resp);
      }
    });

    return function cleanup() {
      mounted = false;
    };
  }, []);

  const setShowCat = (id: any) => {
    setIdCategory(id);
    setShowModalCategory(true);
  };

  return (
    <IonPage>
      <S.StyledContent
        color="content-background-light"
        className="ion-padding ion-text-center"
      >
        <S.Header>
          <S.TitleSearch>
            <div>
              <span>Olá {userData.name},</span>Buscar Matéria
            </div>
            <div onClick={() => logout()}>Sair</div>
          </S.TitleSearch>
          <SearchBar
            readOnly={true}
            onClick={() => setShowModal(true)}
            onChange={() => null}
            autoFocus={true}
            placeholder="Digite sua busca"
          />
        </S.Header>
        <S.TitleSectionUI color={"var(--ion-color-texto-preto)"}>
          Categorias
        </S.TitleSectionUI>
        <IonRow>
          {categories.length > 0
            ? categories.map((el: Keyable) => (
                <RoundButtonHome
                  background={el.color}
                  shadow={`0px 4px 5px ${el.shadow}`}
                  title={el.name}
                  key={el.name}
                  id={el.id}
                  action={setShowCat}
                />
              ))
            : [1, 2, 3, 4, 5, 6].map((el) => (
                <RoundButtonHome
                  id={el}
                  action={() => null}
                  skeleton={true}
                  key={el}
                />
              ))}
        </IonRow>

        <S.TitleSectionUI color={"var(--ion-color-texto-preto)"}>
          Aula Destaque
        </S.TitleSectionUI>

        <S.ScrollHorizontalDiv>
          {best.length > 0
            ? best.map((el: Keyable) => (
                <BoxSpotline
                  key={el.id}
                  tumbnail={`https://plataform-music.s3-sa-east-1.amazonaws.com/imagens/topics/category/${el.subject_id}/${el.image}`}
                  data={el}
                />
              ))
            : [0, 1, 2, 3, 4, 5, 6].map((el) => (
                <BoxSpotline key={el} skeleton={true} />
              ))}
        </S.ScrollHorizontalDiv>

        <IonModal isOpen={showModal} cssClass="my-custom-class">
          <SearchPage setShowModal={setShowModal} />
        </IonModal>
        <IonModal isOpen={showModalCategory} cssClass="my-custom-class">
          <ListCategory
            idCategory={idCategory}
            setShowModal={setShowModalCategory}
          />
        </IonModal>
      </S.StyledContent>
    </IonPage>
  );
};

export default Home;
