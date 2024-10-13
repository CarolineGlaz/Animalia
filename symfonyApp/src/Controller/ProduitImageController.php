<?php

namespace App\Controller;
use App\Repository\ProduitImageRepository;
use App\Repository\ImageRepository;
use App\Entity\Image;
use App\Entity\ProduitImage;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/dashboard/image')]
class ProduitImageController extends AbstractController
{

    private $entityManager;
    private $produitImageRepository;
    private $imageRepository;

    public function __construct(EntityManagerInterface $entityManager, ProduitImageRepository $produitImageRepository, ImageRepository $imageRepository)
    {
        $this->entityManager = $entityManager;
        $this->produitImageRepository = $produitImageRepository;
        $this->imageRepository = $imageRepository;
    }

    #[Route('/add/{produitId}', name: 'upload_image', methods: ['POST'])]
    public function addImage(int $produitId, Request $request): JsonResponse
    {
        $produit = $this->produitImageRepository->find($produitId);

        if (!$produit) {
            return new JsonResponse(['message' => 'Produit non trouvé'], 404);
        }

        $file = $request->files->get('image');
        $alt = $request->request->get('alt');

        if ($file === null) {
            return new JsonResponse(['message' => 'Aucune image envoyée'], 400);
        }

        if ($alt === null) {
            $alt = "No alt";
        }

        // Convertion de l'image en une donnée binaire ou gérer son stockage
        $image = new Image();
        $image->setData(file_get_contents($file->getPathname()));
        $image->setalt($alt);

        // Sauvegarder l'entité Image
        $this->entityManager->persist($image);
        $this->entityManager->flush();

        // Créer une relation avec ProduitImage
        $produitImage = new ProduitImage();
        $produitImage->setIdProduit($produitId);
        $produitImage->setIdImage($image->getId());

        $this->entityManager->persist($produitImage);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Image ajoutée avec succès'], 201);
    }


    #[Route('/delete/{produitId}/{imageId}', name: 'delete_image', methods: ['DELETE'])]
    public function deleteImage(int $produitId, int $imageId ): JsonResponse {

        $produitImage = $this->produitImageRepository->findOneBy([
            'idProduit' => $produitId,
            'idImage' => $imageId
        ]);

        if (!$produitImage) {
            return new JsonResponse(['message' => 'Produit-image non trouvée'], 404);
        }

        // Rechercher l'image et la supprimer
        $image = $this->imageRepository->find($imageId);

        if (!$image) {
            return new JsonResponse(['message' => 'Image non trouvée'], 404);

        }
        $this->entityManager->remove($produitImage);
        $this->entityManager->remove($image);
        $this->entityManager->flush();
        

        return new JsonResponse(['message' => 'Image supprimée avec succès'], 200);
    }
}
