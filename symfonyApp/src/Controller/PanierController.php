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

use function PHPUnit\Framework\isNan;

#[Route('/panier')]
class PanierController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }


    #[Route('/get', name: 'get_panier', methods: ['GET'])]
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

    #[Route('/modifier/{id}', name: 'modifier_panier', methods: ['PUT'])]
    public function modifierPanier(int $id, Request $request): JsonResponse
    {
        $panierArticle = $this->entityManager->getRepository(Panier::class)->find($id);

        if (!$panierArticle) {
            return new JsonResponse(['message' => 'Article non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $idUtilisateur = 1;

        if (isNotCorrect($data['quantite']))
            return new JsonResponse(['message' => 'erreur de lecture de la quantité'], 404);


        if ($panierArticle->getIdUtilisateur() != $idUtilisateur) {
            return new JsonResponse(['message' => "Droit d'acces refusé"], 404);
        };

        if ($data['quantite'] == 0) {
            return $this->supprimerPanier($id);
        }
        $panierArticle->setQuantite($data['quantite']);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Article modifié avec succès'], 200);
    }

    #[Route('/supprimer/{id}', name: 'supprimer_panier', methods: ['DELETE'])]
    public function supprimerPanier(int $id): JsonResponse
    {
        $idUtilisateur = 1;

        $panierArticle = $this->entityManager->getRepository(Panier::class)->find($id);

        if (!$panierArticle) {
            return new JsonResponse(['message' => 'Article non trouvé'], 404);
        }

        if ($panierArticle->getIdUtilisateur() != $idUtilisateur) {
            return new JsonResponse(['message' => "Droit d'accès refusé"], 403);
        }

        $this->entityManager->remove($panierArticle);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Article supprimé du panier'], 200);
    }

    #[Route('/ajouter/{id}', name: 'ajouter_panier', methods: ['POST'])]
    public function ajouterPanier(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isNotCorrect($data['quantite'])) {
            return new JsonResponse(['message' => 'Quantité non trouvé'], 404);
        }
        $quantite = $data['quantite'];


        $idUtilisateur = 1;

        $panierArticle = $this->entityManager->getRepository(Panier::class)->findOneBy([
            'idProduit' => $id,
            'idUtilisateur' => $idUtilisateur,
        ]);

        if ($panierArticle) {
            $panierArticle->setQuantite($panierArticle->getQuantite() + $quantite);
        } else {
            $produit = $this->entityManager->getRepository(Produits::class)->find($id);
            if (!$produit) {
                return new JsonResponse(['message' => "Produit non trouvé"], 404);
            }


            $panierArticle = new Panier();
            $panierArticle->setIdProduit($produit->getId());
            $panierArticle->setQuantite($quantite);
            $panierArticle->setIdUtilisateur($idUtilisateur);

            $this->entityManager->persist($panierArticle);
        }

        $this->entityManager->flush();

        return new JsonResponse(['message' => "L'article à été ajouté au panier"], 200);
    }
}


function isNotCorrect($value)
{
    if (!isset($value))
        return true;

    if (is_nan($value))
        return true;

    if ($value < 1)
        return true;

    return false;
}
