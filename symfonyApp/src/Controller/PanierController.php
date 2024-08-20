<?php

namespace App\Controller;

use App\Entity\Panier;
use App\Entity\User;
use App\Entity\Produits;
use App\Repository\PanierRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/panier')]
class PanierController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }


    #[Route('/get', name: 'get_panier')]
    public function getPanier(Request $request, PanierRepository $panierRepository): JsonResponse
    {
        $idUtilisateur = 1;

        $panierDetails = $panierRepository->findPanierWithProduits($idUtilisateur);

        $jsonResult = [];
        for ($i = 0; $i < count($panierDetails); $i += 2) {
            $object = $panierDetails[$i];
            $object['produit'] = $panierDetails[$i + 1];
            $jsonResult[$i / 2] = $object;
        }

        return new JsonResponse($jsonResult, 200);
    }


    //     $data = json_decode($request->getContent(), true);
    //     // $idUtilisateurs = $data['idUtilisateurs'];
    //     $idProduits = $data['idProduits'];
    //     $quantite = $data['quantite'];

    //     $utilisateur = $this->entityManager->getRepository(User::class)->find($idUtilisateurs);
    //     $produit = $this->entityManager->getRepository(Produits::class)->find($idProduits);

    //     // if (!$utilisateur || !$produit) {
    //     //     return new JsonResponse(['status' => 'Utilisateur ou produit non trouvé'], 404);
    //     // }

    //     // On regarde si l'article est déjà dans le panier
    //     $panierArticle = $this->entityManager->getRepository(Panier::class)->findOneBy([
    //         'idUtilisateurs' => $idUtilisateurs,
    //         'idProduits' => $idProduits
    //     ]);

    //     if ($panierArticle) {
    //         // Si l'article est dedans :
    //         $panierArticle->setQuantite($panierArticle->getQuantite() + $quantite);
    //     } else {
    //         // Sinon :
    //         $panierArticle = new Panier();
    //         $panierArticle->setIdUtilisateurs($idUtilisateurs);
    //         $panierArticle->setIdProduits($idProduits);
    //         $panierArticle->setQuantite($quantite);
    //     }

    //     $this->entityManager->persist($panierArticle);
    //     $this->entityManager->flush();

    // #[Route('/api/panier', name: 'api_panier')]
    // public function getCart(): JsonResponse
    // {
    //     $idUtilisateurs = 1;//$this->getUser();
    //     $panierArticle = $this->entityManager->getRepository(Panier::class)->findBy(['idUtilisateurs' => $idUtilisateurs]);

    //     return new JsonResponse($panierArticle);
    // }

    #[Route('/panier/supprimer/{id}', name: 'supprimer_panier', methods: ['DELETE'])]
    public function supprimerPanier(int $id): JsonResponse
    {
        $panierArticle = $this->entityManager->getRepository(Panier::class)->find($id);

        if (!$panierArticle) {
            return new JsonResponse(['message' => 'Article non trouvé'], 404);
        }

        $this->entityManager->remove($panierArticle);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Article supprimé du panier'], 200);
    }
}
