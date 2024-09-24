<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;

class ProduitImageController extends AbstractController
{
    #[Route('/produits/images/{id}', name: 'add_image', methods: ['POST'])]
    public function addImage($id, Request $request, EntityManagerInterface $entityManager)
    {
        $produit = $entityManager->getRepository(Produits::class)->find($id);
    
        if (!$produit) {
            return new JsonResponse(['message' => 'Produit non trouvé'], 404);
        }
    
        $file = $request->files->get('image');
        $alt = $request->request->get('alt');
    
        if ($file === null) {
            return new JsonResponse(['message' => 'Aucune image envoyée'], 400);
        }
    
        if ($alt === null) {
            return new JsonResponse(['message' => 'Aucune valeur pour alt'], 400);
        }
    
        $image = new Image();
        $image->setData(file_get_contents($file->getPathname()));
        $image->setAlt($alt);
    
        $entityManager->persist($image);
        $entityManager->flush();
    
        $produitImage = new ProduitImage();
        $produitImage->setProduit($produit);
        $produitImage->setImage($image);
    
        $entityManager->persist($produitImage);
        $entityManager->flush();
    
        return new JsonResponse(['message' => 'Image ajoutée avec succès']);
    }

}
